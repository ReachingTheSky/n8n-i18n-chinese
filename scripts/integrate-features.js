const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Enterprise Mock integration...');

// 1. 复制企业版Mock核心文件
function copyEnterpriseMockFiles() {
    console.log('📁 Copying Enterprise Mock files...');
    
    const files = [
        {
            src: 'templates/enterprise-mock/license-mock-enterprise.ts',
            dest: 'n8n-source/packages/cli/src/license-mock-enterprise.ts'
        },
        {
            src: 'templates/enterprise-mock/init-enterprise-mock.ts', 
            dest: 'n8n-source/packages/cli/src/init-enterprise-mock.ts'
        },
        {
            src: 'templates/enterprise-mock/env.enterprise-mock',
            dest: 'n8n-source/.env.enterprise-mock'
        }
    ];
    
    files.forEach(file => {
        if (fs.existsSync(file.src)) {
            const destDir = path.dirname(file.dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(file.src, file.dest);
            console.log(`✅ Copied: ${file.src} -> ${file.dest}`);
        } else {
            console.warn(`⚠️  Source file not found: ${file.src}`);
        }
    });
}

// 2. 修改base-command.ts文件
function patchBaseCommand() {
    console.log('🔧 Patching base-command.ts...');
    
    const filePath = 'n8n-source/packages/cli/src/commands/base-command.ts';
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 添加import语句
    if (!content.includes('initEnterpriseMock')) {
        const importRegex = /import.*from.*['"]@\/license['"];?\n/;
        if (importRegex.test(content)) {
            content = content.replace(
                importRegex,
                `$&import { initEnterpriseMock } from '@/init-enterprise-mock';\n`
            );
            modified = true;
            console.log('✅ Added import statement');
        }
    }
    
    // 在initLicense方法中添加企业版Mock初始化
    if (!content.includes('await initEnterpriseMock()')) {
        // 查找async initLicense()方法
        const initMethodRegex = /(async\s+initLicense\([^)]*\)[^{]*\{)/;
        if (initMethodRegex.test(content)) {
            content = content.replace(
                initMethodRegex,
                `$1\n\t\t// Initialize enterprise mock if enabled\n\t\tawait initEnterpriseMock();\n`
            );
            modified = true;
            console.log('✅ Added enterprise mock initialization');
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('✅ base-command.ts patched successfully');
    } else {
        console.log('ℹ️  base-command.ts already patched or no changes needed');
    }
}

// 3. 验证文件完整性
function validateIntegration() {
    console.log('🔍 Validating integration...');
    
    const requiredFiles = [
        'n8n-source/packages/cli/src/license-mock-enterprise.ts',
        'n8n-source/packages/cli/src/init-enterprise-mock.ts',
        'n8n-source/packages/frontend/@n8n/i18n/src/locales/zh-CN.json'
    ];
    
    let allValid = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} exists`);
        } else {
            console.error(`❌ ${file} missing`);
            allValid = false;
        }
    });
    
    if (allValid) {
        console.log('🎉 All integration files validated successfully');
    } else {
        console.error('❌ Integration validation failed');
        process.exit(1);
    }
}

// 执行集成步骤
try {
    copyEnterpriseMockFiles();
    patchBaseCommand();
    validateIntegration();
    console.log('🎉 Enterprise Mock integration completed successfully!');
} catch (error) {
    console.error('❌ Integration failed:', error.message);
    process.exit(1);
} 