import { useEffect, useState } from "react";
import { Download, CheckCircle } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { getGitHubStatus , getGitHubLoginUrl, getRepositories, importRepository, syncRepository, removeRepository} from "../services/githubservice";


export function GitHubPage() {


    const [status , setStatus] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [importing, setImporting] = useState(null);
    const [importedRepos, setImportedRepos] = useState(new Set());
    const [syncingRepo, setSyncingRepo] = useState(null)
    const [removingRepo, setRemovingRepo] = useState(null)

    useEffect(() => {
        loadStatus();
    }, []);

    useEffect(() => {
        loadGitHub();
    },[]);


    const loadStatus = async () => {
        try{
            const data = await getGitHubStatus();
            setStatus(data);
        } catch  (err){
            console.error(err);
        }
    }


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

    const loadGitHub = async () => {
        const status = await getGitHubStatus();

        setStatus(status);
        if(status.connected){
            await loadRepositories();
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
                next.add(repo.id);
                return next;
            })

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

            await loadRepositories();
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

            await loadRepositories();
        } catch(err){
            console.error(err);
        } finally{
            setRemovingRepo(null);
        }
    }


    return (
        <div className="flex flex-col h-full overflow-hidden">

            <TopBar
                title="GitHub"
                subtitle="Connect and import repositories"
            />

            <div className="flex-1 overflow-y-auto p-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Connection Card */}

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">
{/* 
                                <Github
                                    size={32}
                                    className="text-surface-700 dark:text-surface-300"
                                /> */}

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        GitHub
                                    </h2>

                                    <p className="text-sm text-surface-500">
                                        Connect your GitHub account.
                                    </p>

                                </div>

                            </div>
                            {status?.connected ? (
                                <div className="flex items-center gap-2 text-green-500">
                                    connected as <b>{status.github_username}</b>
                                </div>
                            ) : (
                                <button
                                    onClick ={handleConnect}
                                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white"
                                >
                                    Connect GitHub
                                </button>
                            )}

                        </div>

                    </div>

                    {/* Repository List */}

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">

                        <div className="p-5 border-b border-surface-200 dark:border-surface-800">

                            <h2 className="font-semibold">
                                Repositories
                            </h2>

                        </div>

                       <div className="space-y-3">

    {repositories.map((repo) => (

        <div
            key={repo.id}
            className="flex items-center justify-between p-4 border rounded-xl"
        >

            <div>

                <h3 className="font-medium">
                    {repo.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {repo.private ? "Private" : "Public"}
                </p>

            </div>

{importedRepos.has(repo.id) ? (

<div className="flex gap-2">

    <button
        onClick={() => handleSync(owner, repo.name)}
        disabled={syncingRepo === repo.name}
    >
        {syncingRepo === repo.name
            ? "Syncing..."
            : "Sync"}
    </button>

    <button
        onClick={() => handleRemove(owner, repo.name)}
        disabled={removingRepo === repo.name}
    >
        {removingRepo === repo.name
            ? "Removing..."
            : "Remove"}
    </button>

</div>

    
) : (
    <button
        onClick={() => handleImport(repo)}
        disabled={importing === repo.id}
        className="px-4 py-2 rounded-lg bg-brand-600 text-white"
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

        </div>
    );
}