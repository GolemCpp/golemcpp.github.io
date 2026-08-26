```python
# define a program, library, dependency or export
task = project.program(...)

# apply compiler flags only for gcc
task.when(compiler='gcc',
      cxxflags=['-fstack-protector-all'])
```
