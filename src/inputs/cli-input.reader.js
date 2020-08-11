export class CliInputReader {
    async read() {
        const [ repo, packageName, version ] = Array.from(process.argv).slice(-3);

        return {
            repo: repo,
            package: {
                name: packageName,
                version: version
            },
        }
    }
}