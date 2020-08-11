import child_process from 'child_process';

export class NpmPackageUpdater {
    async upgrade(rootDir, { name, version}) {
        
        const result = child_process.spawnSync('npm', ['install', '--save', `${name}@${version}`], {
            cwd: rootDir
        });

        if (result?.status !== 0) {
            throw result?.error;
        }

        return true;
    }
}