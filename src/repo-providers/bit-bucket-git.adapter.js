import git from 'simple-git';
import path from 'path';
import fs from 'fs';
import { Bitbucket } from 'bitbucket';

export class BitBucketGitAdapter {
    constructor ({ credentials: { user, password }}) {

        this.user = user;
        this.password = password;
        this.baseDir = path.join(process.cwd(), 'repos');

 
        this.bitbucket = new Bitbucket({
            baseUrl: 'https://api.bitbucket.org/2.0',
            auth: {
                username: this.user,
                password: this.password,
            },
        });
    }

    async cloneRepo(repo, branchName) {
        const repoUri = `https://${this.user}:${this.password}@${repo}`;
  
        let [ repoName, workspace ] = repo.split('/').reverse();

        const repoDirName = `${branchName}_${Date.now().toString()}`;

        await git({ baseDir: this.baseDir }).silent(true).clone(repoUri, repoDirName);

        const repoGit =  this.repoGit(repoDirName);

        const { current: mainBranch } = await repoGit.status({
            "-b": true, 
            "-s": true,
            "-uno": true
        });

        await repoGit.checkoutLocalBranch(repoDirName);

        // TODO: Perform configuration of git user
    

        return {
            path: path.join(this.baseDir, repoDirName),
            branchName: repoDirName,
            mainBranch,
            workspace,
            repoName: repoName.replace('.git', '')
        }
    }

    async pushRepoChanges(repoDetails, title = "Upgrade package.json") {

        const { path, branchName} = repoDetails;

        const repoGit =  git({ baseDir: path });

        await repoGit.add('./*')
            .commit(title)
            .push('origin', branchName);

        const prDetails = await this.createPr(repoDetails, title);

        return prDetails;
    }

    async createPr(repoDetails, title) {
        const { branchName, mainBranch, repoName, workspace } = repoDetails;
        const _body = {
            "title": title,
            "source": {
                "branch": {
                    "name": branchName
                }
            },
            "destination": {
                "branch": {
                    "name": mainBranch
                }
            }
        }

        const { data, headers  } = await this.bitbucket.pullrequests.create({ 
            _body,
            repo_slug: repoName,
            workspace: workspace
        });

        return data;
    }

    repoGit(repoDirName) {
        return  git({ baseDir: path.join(this.baseDir, repoDirName) });
    }

}