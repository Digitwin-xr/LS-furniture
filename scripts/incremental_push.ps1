$gitPath = "C:\Users\digit\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe"
$modelsDir = "public/assets/models"

# 1. Reset to origin/main
& $gitPath reset --soft origin/main
& $gitPath reset .

# 2. Add core files first
& $gitPath add .gitignore scripts/stitch_bind.js public/products.json
& $gitPath commit -m "chore: initial Vercel migration config and binding logic"
& $gitPath push origin main

# 3. Add models in batches of 5
$models = Get-ChildItem -Path "$modelsDir/*.glb" | Where-Object { $_.Length -le 10MB }
$batchSize = 5
$totalBatches = [Math]::Ceiling($models.Count / $batchSize)

for ($i = 0; $i -lt $totalBatches; $i++) {
    $start = $i * $batchSize
    $currentBatch = $models | Select-Object -Skip $start -First $batchSize
    
    foreach ($file in $currentBatch) {
        $relPath = "$modelsDir/" + $file.Name
        & $gitPath add "$relPath"
    }
    
    $msg = "assets: add 3D models batch $($i + 1) of $totalBatches"
    & $gitPath commit -m "$msg"
    
    Write-Host ">>> Pushing Batch $($i + 1)..."
    & $gitPath push origin main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Push failed on batch $($i + 1). Retrying in 5 seconds..."
        Start-Sleep -Seconds 5
        & $gitPath push origin main
    }
}

Write-Host "=== Incremental Push Complete! ==="
