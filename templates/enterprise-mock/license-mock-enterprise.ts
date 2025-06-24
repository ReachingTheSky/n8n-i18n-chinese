/**
 * 企业版许可证模拟器 - 仅用于开发和测试环境
 * 基于 mock.md 文档实现
 */

import type { BooleanLicenseFeature, NumericLicenseFeature } from '@n8n/constants';
import { LICENSE_FEATURES, LICENSE_QUOTAS, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import type { License } from '@/license';

export class EnterpriseLicenseMocker {
    private static instance: EnterpriseLicenseMocker;
    private originalMethods: Map<string, any> = new Map();

    static getInstance(): EnterpriseLicenseMocker {
        if (!EnterpriseLicenseMocker.instance) {
            EnterpriseLicenseMocker.instance = new EnterpriseLicenseMocker();
        }
        return EnterpriseLicenseMocker.instance;
    }

    /**
     * 启用所有企业版功能
     */
    enableAllEnterpriseFeatures(license: License): void {
        console.log('[ENTERPRISE MOCK] 🚀 Enabling all enterprise features...');

        // 保存原始方法
        this.originalMethods.set('isLicensed', license.isLicensed.bind(license));
        this.originalMethods.set('getValue', license.getValue.bind(license));

        // 模拟许可证检查 - 所有功能都返回true
        license.isLicensed = (feature: BooleanLicenseFeature): boolean => {
            // 特殊处理：隐藏非生产环境横幅
            if (feature === 'feat:showNonProdBanner') {
                return false;
            }
            console.log(`[ENTERPRISE MOCK] ✅ Feature enabled: ${feature}`);
            return true;
        };

        // 模拟配额值 - 返回无限制
        license.getValue = (feature: string): any => {
            if (feature === 'planName') {
                return 'Enterprise (Mocked)';
            }

            // 配额类型返回无限制
            if (Object.values(LICENSE_QUOTAS).includes(feature as any)) {
                console.log(`[ENTERPRISE MOCK] ♾️  Quota unlimited: ${feature}`);
                return UNLIMITED_LICENSE_QUOTA;
            }

            // 布尔功能返回true
            if (Object.values(LICENSE_FEATURES).includes(feature as any)) {
                return true;
            }

            return this.originalMethods.get('getValue')?.(feature);
        };

        // 模拟所有企业版方法
        this.mockEnterpriseMethods(license);

        console.log('[ENTERPRISE MOCK] 🎉 All enterprise features enabled successfully');
    }

    private mockEnterpriseMethods(license: License): void {
        // 认证相关
        license.isSamlEnabled = () => true;
        license.isLdapEnabled = () => true;
        license.isOidcEnabled = () => true;

        // 权限和角色
        license.isAdvancedPermissionsLicensed = () => true;
        license.isProjectRoleEditorLicensed = () => true;
        license.isProjectRoleViewerLicensed = () => true;

        // 功能模块
        license.isSourceControlLicensed = () => true;
        license.isExternalSecretsEnabled = () => true;
        license.isVariablesEnabled = () => true;
        license.isWorkflowHistoryLicensed = () => true;
        license.isDebugInEditorLicensed = () => true;
        license.isBinaryDataS3Licensed = () => true;
        license.isMultiMainLicensed = () => true;
        license.isLogStreamingEnabled = () => true;
        license.isWorkerViewLicensed = () => true;

        // AI功能
        license.isAiAssistantEnabled = () => true;
        license.isAskAiEnabled = () => true;

        // 配额方法
        license.getUsersLimit = () => UNLIMITED_LICENSE_QUOTA;
        license.getTriggerLimit = () => UNLIMITED_LICENSE_QUOTA;
        license.getVariablesLimit = () => UNLIMITED_LICENSE_QUOTA;
        license.getWorkflowHistoryPruneLimit = () => UNLIMITED_LICENSE_QUOTA;
        license.getTeamProjectLimit = () => UNLIMITED_LICENSE_QUOTA;
        license.getAiCredits = () => 999999;
        license.isWithinUsersLimit = () => true;

        // 许可证信息
        license.getPlanName = () => 'Enterprise (Mocked)';
        license.getConsumerId = () => 'enterprise-mock-consumer';
        license.getManagementJwt = () => 'mock-jwt-token';
    }

    /**
     * 检查是否为开发/测试环境
     */
    static isDevelopmentEnvironment(): boolean {
        return (
            process.env.NODE_ENV !== 'production' &&
            (process.env.NODE_ENV === 'development' ||
                process.env.NODE_ENV === 'test' ||
                process.env.N8N_ENTERPRISE_MOCK === 'true')
        );
    }

    /**
     * 恢复原始许可证方法
     */
    restore(license: License): void {
        if (this.originalMethods.has('isLicensed')) {
            license.isLicensed = this.originalMethods.get('isLicensed');
        }
        if (this.originalMethods.has('getValue')) {
            license.getValue = this.originalMethods.get('getValue');
        }
        this.originalMethods.clear();
        console.log('[ENTERPRISE MOCK] 🔄 Original license methods restored');
    }
}

/**
 * 启用企业版模拟
 */
export function enableEnterpriseMock(license: License): void {
    if (!EnterpriseLicenseMocker.isDevelopmentEnvironment()) {
        console.warn('[ENTERPRISE MOCK] ⚠️  Not in development environment, skipping mock');
        return;
    }

    EnterpriseLicenseMocker.getInstance().enableAllEnterpriseFeatures(license);
}

/**
 * 禁用企业版模拟
 */
export function disableEnterpriseMock(license: License): void {
    EnterpriseLicenseMocker.getInstance().restore(license);
} 