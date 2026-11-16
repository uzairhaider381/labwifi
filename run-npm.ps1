param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)
$env:PATH = "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs;" + $env:PATH
$env:ELECTRON_BUILDER_CACHE = "D:\semproject\desktop\.cache"
$env:electron_config_cache = "D:\semproject\desktop\.cache"
$env:ELECTRON_CACHE = "D:\semproject\desktop\.cache"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
& "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs\npm.cmd" @Args
