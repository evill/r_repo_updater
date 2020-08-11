import { CliInputReader } from './inputs/cli-input.reader';
import { Logger } from './logging/logger';
import { RepoAdapterFactory } from './repo-providers/repo-adapter.factory';
import { PackageUpdater } from './package-updater';
import { RepoConfigService } from './repo-config/repo-config-service';
import { NpmPackageUpdater } from './package-updater/npm-package-updater';

const logger = new Logger();

async function runCliScript () {
    const inputReader = new CliInputReader();
    const repoAdapterFactory = new RepoAdapterFactory();
    const repoConfigService = new RepoConfigService();
    const packageUpdater = new NpmPackageUpdater();
    
    const input = await inputReader.read();
    
    const updater = new PackageUpdater(
        logger,
        repoConfigService,
        repoAdapterFactory,
        packageUpdater
    );
    
    return updater.execute(input);
}

runCliScript()
    .then( ({ prInfo }) => {
        logger.info(prInfo);

        process.exit(0)
    })
    .catch( (error) => {
        logger.error(error);
        process.exit(1);
    });