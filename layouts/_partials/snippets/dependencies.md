```python
# triggers the recipe mechanism
project.dependency(
  ..., # more options
  repository="https://github.com/nlohmann/json.git"
  # asking no version asks for the latest release
)

# link the dependency, and further declare more dependencies
project.program(
  ...,
  deps=[
    "@json", # matches the fully declared dependency above
    "@gsl@microsoft#^4.0.0" # resolves to v4.2.2
                            # delegate the remote URL to the recipe
  ]
)
```
