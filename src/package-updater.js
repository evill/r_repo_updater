
/**
interface ExecutionState {
    input
}
 */

export class PackageUpdater {
    constructor(logger, repoConfigService, repoAdapterFactory, packageUpdater) {
        this.logger = logger;
        this.repoConfigService = repoConfigService;
        this.repoAdapterFactory = repoAdapterFactory;
        this.packageUpdater = packageUpdater;
    }

    async readRepoConfig(repo) {
        return this.repoConfigService.resolve(repo);
    }

    async execute(input) {
        const { repo, package: packageInfo } = input;

        this.logger.info(`Target Repository: ${repo}`);
        this.logger.info(`Package for update: ${packageInfo.name}@${packageInfo.version}`);

        const repoConfig = await this.readRepoConfig(input.repo);

        const repoAdapter = this.repoAdapterFactory.create(repoConfig);

        const repoSrc = await repoAdapter.cloneRepo(
            input.repo, `upgrade_${input.package.name}_to_${input.package.version}`
        );

        await this.packageUpdater.upgrade(repoSrc.path, input.package );

        const prInfo = await repoAdapter.pushRepoChanges(
            repoSrc,
            `Upgrade package ${input.package.name} to version ${input.package.version}`
        );

        return {
            input,
            prInfo: prInfo
        }
    }
}