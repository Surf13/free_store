$ErrorActionPreference = "Stop"

$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# IMPORTANT: images are inside the "small" directory
$imageRoot = "C:\Users\kyler\Projects_Folder\Intro_React_Project\NextJS Project\my-app-web-store\abo\abo-images-small\images\small"

$csvPath = "C:\Users\kyler\Projects_Folder\Intro_React_Project\NextJS Project\my-app-web-store\abo\abo-images-small\images\metadata\images.csv\images.csv"

$bucket = "product-images-freestore"

Write-Host "Reading image metadata..." -ForegroundColor Cyan

$rows = Import-Csv $csvPath | Select-Object -First 500

Write-Host "Found $($rows.Count) images to upload." -ForegroundColor Green
Write-Host ""

$uploaded = 0
$missing = 0
$failed = 0

foreach ($row in $rows) {

    $relativePath = $row.path
    $localPath = Join-Path $imageRoot $relativePath

    if (-not (Test-Path $localPath)) {
        Write-Host "MISSING: $localPath" -ForegroundColor Red
        $missing++
        continue
    }

    $s3Key = $relativePath -replace "\\", "/"

    Write-Host "Uploading $s3Key..." -ForegroundColor Yellow

    & $aws s3 cp $localPath "s3://$bucket/$s3Key"

    if ($LASTEXITCODE -eq 0) {
        $uploaded++
    }
    else {
        Write-Host "FAILED: $relativePath" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Upload complete!" -ForegroundColor Green
Write-Host "Uploaded: $uploaded" -ForegroundColor Green
Write-Host "Missing:  $missing" -ForegroundColor Red
Write-Host "Failed:   $failed" -ForegroundColor Red
Write-Host "==============================" -ForegroundColor Cyan