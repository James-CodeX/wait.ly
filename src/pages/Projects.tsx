import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { projectsService, Project } from '../services/projects';

export default function Projects() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    try {
      // Store selected project in localStorage
      localStorage.setItem('selectedProjectId', projectId);
      navigate(`/dashboard?project=${projectId}`);
    } catch (error) {
      showToast('Failed to select project', 'error');
    }
  };

  const handleCreateProject = async () => {
    setErrors({});
    if (!formData.name.trim()) {
      setErrors({ name: 'Project name is required' });
      showToast('Project name is required', 'error');
      return;
    }

    setCreating(true);
    try {
      const newProject = await projectsService.createProject(formData.name, formData.description);
      setProjects([newProject, ...projects]);
      setCreateModal(false);
      setFormData({ name: '', description: '' });
      showToast('Project created successfully!', 'success');
      
      // Auto-select the new project and navigate to dashboard
      localStorage.setItem('selectedProjectId', newProject.id);
      navigate(`/dashboard?project=${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      showToast('Failed to create project', 'error');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 to-white dark:from-dark-bg dark:to-dark-card p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 w-64 bg-mint-50 dark:bg-dark-card rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-mint-50 dark:bg-dark-card rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-white dark:from-dark-bg dark:to-dark-card p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-mint-900 dark:text-dark-text mb-2">Your Waitlists</h1>
            <p className="text-mint-900/70 dark:text-dark-text-muted">Select a project to manage or create a new one</p>
          </div>
          <Button onClick={() => setCreateModal(true)}>
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                hover
                className="cursor-pointer h-full"
                onClick={() => handleSelectProject(project.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-mint-600 dark:bg-mint-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-mint-900/50 dark:text-dark-text-muted">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-2">{project.name}</h3>
                <p className="text-mint-900/70 dark:text-dark-text-muted text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-4 pt-4 border-t border-mint-600/10 dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-mint-600 dark:text-mint-400" />
                    <span className="text-sm font-medium text-mint-900 dark:text-dark-text">
                      {project.total_signups} signups
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Empty state */}
          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="text-center py-12">
                <Users className="w-16 h-16 text-mint-600 dark:text-mint-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-mint-900 dark:text-dark-text mb-2">No projects yet</h3>
                <p className="text-mint-900/70 dark:text-dark-text-muted mb-6">
                  Create your first waitlist project to get started
                </p>
                <Button onClick={() => setCreateModal(true)}>
                  <Plus className="w-5 h-5" />
                  Create Your First Project
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Waitlist"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g., My Awesome Product"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 ${
                errors.name ? 'border-red-500' : 'border-mint-600/20 dark:border-dark-border'
              } rounded-xl text-mint-900 dark:text-dark-text placeholder-mint-900/40 dark:placeholder-dark-text-muted focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 focus:ring-4 focus:ring-mint-600/10 dark:focus:ring-mint-500/20 transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Brief description of your waitlist..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text placeholder-mint-900/40 dark:placeholder-dark-text-muted focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 focus:ring-4 focus:ring-mint-600/10 dark:focus:ring-mint-500/20 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setCreateModal(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} loading={creating}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
