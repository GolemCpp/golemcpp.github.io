``` python
# define the library
project.library(name='mylib', ...)

# export the library
project.export(name='mylib',
                includes='mylib/include')

# link the library
project.program(..., use=['mylib'])
```
