/**
 * 企业版模拟初始化器
 * 在应用启动时自动检查并启用企业版功能模拟
 */

import { Container } from '@n8n/di';
import { License } from '@/license';
import { enableEnterpriseMock, EnterpriseLicenseMocker } from '@/license-mock-enterprise';

/**
 * 初始化企业版模拟
 */
export async function initEnterpriseMock(): Promise<void> {
    if (!shouldEnableEnterpriseMock()) {
        return;
    }

    try {
        console.log('[ENTERPRISE MOCK] 🔄 Initializing enterprise mock...');

        const license = Container.get(License);
        if (!license) {
            console.warn('[ENTERPRISE MOCK] ⚠️  License service not available');
            return;
        }

        // 启用企业版模拟
        enableEnterpriseMock(license);

        // 显示启用的功能列表
        showEnabledFeatures();

    } catch (error) {
        console.error('[ENTERPRISE MOCK] ❌ Failed to initialize:', error);
    }
}

/**
 * 检查是否应该启用企业版模拟
 */
function shouldEnableEnterpriseMock(): boolean {
    // 检查环境变量
    if (process.env.N8N_ENTERPRISE_MOCK === 'true') {
        return true;
    }

    // 检查开发环境
    if (EnterpriseLicenseMocker.isDevelopmentEnvironment()) {
        return true;
    }

    // 检查命令行参数
    if (process.argv.includes('--enterprise-mock')) {
        return true;
    }

    return false;
}

/**
 * 显示启用的企业版功能
 */
function showEnabledFeatures(): void {
    console.log('');
    console.log('🚀 N8N ENTERPRISE MOCK ENABLED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Authentication & Security:');
    console.log('  ✅ SAML/LDAP/OIDC Authentication');
    console.log('  ✅ Advanced Permissions & RBAC');
    console.log('  ✅ External Secrets Management');
    console.log('');
    console.log('📁 Organization & Management:');
    console.log('  ✅ Folders Organization');
    console.log('  ✅ Project Management');
    console.log('  ✅ Variables Management');
    console.log('  ✅ Workflow History');
    console.log('');
    console.log('🔄 Development & Operations:');
    console.log('  ✅ Source Control (Git)');
    console.log('  ✅ Debug in Editor');
    console.log('  ✅ Log Streaming');
    console.log('  ✅ Worker View');
    console.log('');
    console.log('🏗️ Infrastructure & Scaling:');
    console.log('  ✅ Multi-Instance Support');
    console.log('  ✅ S3 Binary Data Storage');
    console.log('  ✅ Advanced Execution Filters');
    console.log('');
    console.log('🤖 AI & Analytics:');
    console.log('  ✅ AI Assistant & Credits');
    console.log('  ✅ AI Q&A Features');
    console.log('  ✅ Insights & Analytics');
    console.log('');
    console.log('⚠️  WARNING: This is for development/testing only');
    console.log('   Do NOT use in production environments');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
} 