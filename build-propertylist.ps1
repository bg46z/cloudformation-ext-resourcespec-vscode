$resourcespecraw = Get-Content -Raw .\src\CloudFormationResourceSpecification.original.json
$resourcespec = ConvertFrom-Json $resourcespecraw
$resourceTypes = $resourcespec.ResourceTypes
$properties = $resourceTypes.PSObject.properties | ForEach-Object {$_.Value }
$names = $properties.Properties | ForEach-Object {$_.PSObject.Properties } | Select-Object Name
$uniquenames = $names | Sort-Object Name -CaseSensitive | Get-Unique -AsString

$un = $uniquenames | ForEach-Object {$_.Name}

$un | ConvertTo-Json | Out-File -FilePath "./src/AllPropertiesSorted.json"