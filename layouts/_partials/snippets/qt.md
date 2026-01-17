``` python
# golem configure --qtdir=<path>
project.program(
  name='hello-qt',
  source=['src'],
  moc=['src'],
  features=['QT6CORE'] # QT6WIDGETS, etc.
)
```
