```python
# golem tools install cppfront
# golem configure --variant=debug
project.program(
  name='hello-cppfront',
  source=['src'],
  cpp2flags=[...] # default is -p
)
```
