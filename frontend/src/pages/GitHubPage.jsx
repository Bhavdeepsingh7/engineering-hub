import { useEffect, useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { getGitHubStatus , getGitHubLoginUrl, getRepositories, importRepository, syncRepository, removeRepository, getImportedRepositories } from "../services/githubservice";


export function GitHubPage() {


    const [status , setStatus] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [importing, setImporting] = useState(null);
    const [importedRepos, setImportedRepos] = useState(new Set());
    const [syncingRepo, setSyncingRepo] = useState(null)
    const [removingRepo, setRemovingRepo] = useState(null)
    const [repoToRemove, setRepoToRemove] = useState(null);

    useEffect(() => {
        let active = true;

        const loadInitialGitHubState = async () => {
            try {
                const connection = await getGitHubStatus();
                if (!active) return;
                setStatus(connection);
                if (!connection.connected) return;

                const [repos, imported] = await Promise.all([getRepositories(), getImportedRepositories()]);
                if (!active) return;
                setRepositories(repos);
                setImportedRepos(new Set(imported.map((repo) => `${repo.owner}/${repo.repo}`)));
            } catch (error) {
                console.error("Failed to load GitHub state", error);
            }
        };

        loadInitialGitHubState();
        return () => { active = false; };
    }, []);

    const handleConnect = async () => {
        try{
            const data = await getGitHubLoginUrl();
            window.location.href = data.url;
        } catch (err){
            console.error(err);
        }
    }


    const loadRepositories = async () => {
        try{

            const data = await getRepositories();
            setRepositories(data);
        } catch (err){
            console.error(err);
        }
    };

    const handleImport = async (repo) => {

        setImporting(repo.id)
        try{
            const result = await importRepository(
                status.github_username,
                repo.name,
            );

            setImportedRepos(prev => {
                const next = new Set(prev);
                next.add(`${status.github_username}/${repo.name}`);
                return next;
            })

            await loadImportedRepositories();

            console.log(result)
        } catch(err){
            console.error(err)
        } finally{
            setImporting(null);
        }
    }


    const handleSync = async (owner , repo) => {
        try{
            setSyncingRepo(repo);

            await syncRepository(owner, repo);

            await Promise.all([
    loadRepositories(),
    loadImportedRepositories(),
]);

        } catch(err){
            console.error(err);
        } finally{
            setSyncingRepo(null);
        }
    }


    const handleRemove = async (owner , repo) => {
        try {
            setRemovingRepo(repo);

            await removeRepository(owner, repo);

            await Promise.all([
    loadRepositories(),
    loadImportedRepositories(),
]);
        } catch(err){
            console.error(err);
        } finally{
            setRemovingRepo(null);
        }
    }


    const loadImportedRepositories = async () => {
        try{
            const data = await getImportedRepositories();

            const set = new Set(
                data.map(
                    repo => `${repo.owner}/${repo.repo}`
                )
            );

            setImportedRepos(set)

        } catch(err){
            console.error(err)
        }
    }


    return (
        <div className="flex flex-col h-full overflow-hidden">

            <TopBar
                title="GitHub"
                subtitle="Connect and import repositories"
            />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Connection Card */}

                    <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900 sm:p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex min-w-0 items-center gap-4">
{/* 
                                <Github
                                    size={32}
                                    className="text-surface-700 dark:text-surface-300"
                                /> */}

                                <div className="min-w-0">

                                    <h2 className="text-lg font-semibold">
                                        GitHub
                                    </h2>

                                    <p className="text-sm text-surface-500">
                                        Connect your GitHub account.
                                    </p>

                                </div>

                            </div>
                            {status?.connected ? (
                                <div className="break-all text-sm text-green-500 sm:text-base">
                                    connected as <b>{status.github_username}</b>
                                </div>
                            ) : (
                                <button
                                    onClick ={handleConnect}
                                    className="min-h-11 w-full rounded-xl bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 sm:w-auto"
                                >
                                    Connect GitHub
                                </button>
                            )}

                        </div>

                    </div>

                    {/* Repository List */}

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">

                        <div className="p-4 border-b border-surface-200 dark:border-surface-800 sm:p-5">

                            <h2 className="font-semibold">
                                Repositories
                            </h2>

                        </div>

                       <div className="space-y-3">

    {repositories.map((repo) => (

        <div
            key={repo.id}
            className="flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between"
        >

            <div className="min-w-0">

                <h3 className="truncate font-medium">
                    {repo.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {repo.private ? "Private" : "Public"}
                </p>

            </div>

{importedRepos.has(`${status.github_username}/${repo.name}`) ? (

<div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">

    <button
        onClick={() => handleSync(status.github_username, repo.name)}
        disabled={syncingRepo === repo.name}
        className="min-h-11 flex-1 rounded-lg bg-brand-600 px-4 py-2 text-white sm:flex-none"
    >
        {syncingRepo === repo.name
            ? "Syncing..."
            : "Sync"}
    </button>

    <button
        onClick={() => setRepoToRemove(repo)}
        disabled={removingRepo === repoToRemove?.name}
        className="min-h-11 flex-1 rounded-lg bg-red-500 px-4 py-2 text-white sm:flex-none"
    >
        {removingRepo === repoToRemove?.name
            ? "Removing..."
            : "Remove"}
    </button>

</div>

    
) : (
    <button
        onClick={() => handleImport(repo)}
        disabled={importing === repo.id}
        className="min-h-11 w-full rounded-lg bg-brand-600 px-4 py-2 text-white sm:w-auto"
    >
        {importing === repo.id ? "Importing..." : "Import"}
    </button>
)}

        </div>

    ))}

</div>

                    </div>

                </div>

            </div>

{repoToRemove && (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">

        <div role="dialog" aria-modal="true" className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-xl dark:bg-surface-900 sm:p-6">

            <h2 className="text-lg font-semibold">
                Remove Repository
            </h2>

            <p className="mt-2 text-sm">
    Are you sure you want to remove{" "}
    <span className="font-semibold text-surface-900 dark:text-surface-100">
        {repoToRemove.name}
    </span>
    ?
</p>


            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                    onClick={() => setRepoToRemove(null)}
                    className="min-h-11 w-full rounded-lg border px-4 py-2 sm:w-auto"
                >
                    Cancel
                </button>

                <button
                    onClick={async () => {

                        await handleRemove(
                            status.github_username,
                            repoToRemove.name
                        );

                        setRepoToRemove(null);

                    }}
                    className="min-h-11 w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 sm:w-auto"
                >
                     {removingRepo === repoToRemove?.name
            ? "Removing..."
            : "Remove"}
                </button>

            </div>

        </div>

    </div>
)}


        </div>
    );
}
