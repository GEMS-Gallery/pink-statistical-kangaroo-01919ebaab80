import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface Project {
  id: bigint;
  title: string;
  category: string;
  url: string;
}

function App() {
  const theme = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await backend.getProjects();
      setProjects(result.map(p => ({ ...p, id: BigInt(p.id) })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await backend.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    try {
      const result = await backend.getProjectsByCategory(category);
      setProjects(result.map(p => ({ ...p, id: BigInt(p.id) })));
    } catch (error) {
      console.error('Error fetching projects by category:', error);
    }
  };

  const handleAddProject = async (data: { title: string; category: string; url: string }) => {
    try {
      await backend.addProject(data.title, data.category, data.url);
      setOpenDialog(false);
      reset();
      fetchProjects();
      fetchCategories();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GEM's Showcase
          </Typography>
          <Button color="inherit" onClick={() => setOpenDialog(true)}>Add Project</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Categories</Typography>
            <List>
              {categories.map((category) => (
                <ListItem
                  button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  selected={selectedCategory === category}
                >
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>Projects</Typography>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={Number(project.id)}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{project.title}</Typography>
                      <Typography color="textSecondary">{project.category}</Typography>
                      <Button href={project.url} target="_blank" rel="noopener noreferrer">
                        Visit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <form onSubmit={handleSubmit(handleAddProject)}>
          <DialogContent>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Category"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="url"
              control={control}
              defaultValue=""
              rules={{ required: 'URL is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="URL"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default App;
