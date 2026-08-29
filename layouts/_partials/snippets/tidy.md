```python
# all my compiler flags
# can be extracted into a dependency
task = project.export(
  name="global",
  cxxflags=["..."]
)

task.when(
  variant="debug",
  cxxflags=["..."]
)

# my targets
project.library(..., use=["global"])
project.program(..., use=["global"])
```
