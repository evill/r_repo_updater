import { BitBucketGitAdapter } from './bit-bucket-git.adapter';
import { BITBUCKET_PROVIDER_NAME, GIT_REPO_TYPE } from './repo-providers.constants';

export class RepoAdapterFactory {
    create(repoConfig) {
        const { provider, type } = repoConfig;
        if (
            (provider === BITBUCKET_PROVIDER_NAME) &&
            type === GIT_REPO_TYPE
        ) {
            return new BitBucketGitAdapter(repoConfig);
        }
    }
}