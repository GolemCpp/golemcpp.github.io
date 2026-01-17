``` python
# dependencies can be customized too
task = project.dependency(...,
  version='main' # Follow branch 'main'
  variant='release', # Force release
  link='static', # Force static linking
  cxxflags=['...'] # Add compiler flags
)
task.when(osystem='windows',
          defines=['FOO_BAR'])
```
