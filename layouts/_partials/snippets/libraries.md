```python
# define the library
project.library(name="mylib")  # ...and any other configuration parameter

# export the library
project.export(
  name="mylib",
  includes="mylib/include"
)

# link the library
project.program(..., use=["mylib"])
```
