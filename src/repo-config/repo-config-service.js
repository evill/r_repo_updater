import { BITBUCKET_PROVIDER_NAME, GIT_REPO_TYPE } from '../repo-providers/repo-providers.constants';

export class RepoConfigService {
    async resolve(repo) {
        return {
            provider: BITBUCKET_PROVIDER_NAME,
            type: GIT_REPO_TYPE,
            credentials: {
                user: process.env.GIT_USER, // Bitbucket user name
                password: process.env.GIT_PASS // Bitbucket application password
            },
            // settings for git config to perform commit
            comitter: {
                name: "",
                email: ""
            }
        }
    }
}