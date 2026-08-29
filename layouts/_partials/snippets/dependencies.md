```python
# triggers the recipe mechanism
project.dependency(
  name="json",
  repository="https://github.com/nlohmann/json.git",
  version="^3.0.0",  # Resolves to v3.12.0
  shallow=True,
)

# link the dependency
project.program(..., deps=["json"])
```
