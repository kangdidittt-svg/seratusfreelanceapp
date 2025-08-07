# Script untuk menambahkan test projects ke aplikasi menggunakan curl
# Pastikan server sudah running di localhost:3000

Write-Host "Starting to add test projects..." -ForegroundColor Green

# Login terlebih dahulu untuk mendapatkan auth cookie
$loginData = '{"username":"admin","password":"admin123"}'

# Login dan simpan cookies
$cookieJar = "$env:TEMP\cookies.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue

$loginResult = curl -s -c $cookieJar -X POST -H "Content-Type: application/json" -d $loginData "http://localhost:3000/api/auth/login"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Login successful!" -ForegroundColor Green
    
    # Array of test projects
    $projects = @(
        '{"title":"E-commerce Website Development","client":"TechCorp Solutions","description":"Developing a modern e-commerce platform with React and Node.js","category":"Web Development","budget":"5000","deadline":"2024-12-15","priority":"High","status":"In Progress"}',
        '{"title":"Mobile App UI/UX Design","client":"StartupXYZ","description":"Creating user interface and experience design for mobile application","category":"UI/UX Design","budget":"3500","deadline":"2024-11-30","priority":"Medium","status":"In Progress"}',
        '{"title":"Brand Identity Package","client":"Creative Agency Ltd","description":"Complete branding package including logo, colors, and guidelines","category":"Branding","budget":"2800","deadline":"2024-10-25","priority":"Low","status":"In Progress"}',
        '{"title":"Corporate Website Redesign","client":"DataCorp Inc","description":"Complete redesign of corporate website with modern look","category":"Web Development","budget":"4200","deadline":"2024-09-15","priority":"High","status":"Completed"}',
        '{"title":"Marketing Campaign Graphics","client":"Local Business","description":"Social media graphics and marketing materials","category":"Marketing","budget":"1500","deadline":"2024-08-30","priority":"Medium","status":"Completed"}',
        '{"title":"Database Optimization Consulting","client":"Enterprise Solutions","description":"Performance optimization for large-scale database systems","category":"Consulting","budget":"6500","deadline":"2025-01-20","priority":"High","status":"Pending"}',
        '{"title":"iOS App Development","client":"Mobile Startup","description":"Native iOS application development from scratch","category":"Mobile App","budget":"8000","deadline":"2025-02-28","priority":"Low","status":"Pending"}'
    )
    
    $projectTitles = @(
        "E-commerce Website Development",
        "Mobile App UI/UX Design", 
        "Brand Identity Package",
        "Corporate Website Redesign",
        "Marketing Campaign Graphics",
        "Database Optimization Consulting",
        "iOS App Development"
    )
    
    # Add each project
    $successCount = 0
    $errorCount = 0
    
    for ($i = 0; $i -lt $projects.Count; $i++) {
        $project = $projects[$i]
        $title = $projectTitles[$i]
        
        try {
            $result = curl -s -b $cookieJar -X POST -H "Content-Type: application/json" -d $project "http://localhost:3000/api/projects"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Added: $title" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "❌ Failed to add: $title" -ForegroundColor Red
                Write-Host "Response: $result" -ForegroundColor Yellow
                $errorCount++
            }
        }
        catch {
            Write-Host "❌ Error adding $title : $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
        
        Start-Sleep -Milliseconds 500  # Small delay between requests
    }
    
    Write-Host "`n📊 Summary:" -ForegroundColor Cyan
    Write-Host "✅ Successfully added: $successCount projects" -ForegroundColor Green
    Write-Host "❌ Failed to add: $errorCount projects" -ForegroundColor Red
    Write-Host "📋 Total projects: $($projects.Count)" -ForegroundColor Yellow
    
    if ($successCount -gt 0) {
        Write-Host "`n🎉 Test projects have been added! You can now view them in the application." -ForegroundColor Green
    }
    
    # Cleanup
    Remove-Item $cookieJar -ErrorAction SilentlyContinue
    
} else {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Response: $loginResult" -ForegroundColor Red
}

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")