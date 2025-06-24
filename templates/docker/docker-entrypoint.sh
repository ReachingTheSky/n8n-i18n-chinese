#!/bin/sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# 显示启动横幅
show_banner() {
    echo -e "${GREEN}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 N8N 企业版整合版 (Enterprise Mock + Chinese i18n)      ║
║                                                              ║
║    🌏 中文界面支持                                            ║
║    🏢 企业版功能模拟                                          ║
║    🔧 开发测试专用                                            ║
║                                                              ║
║    访问地址: http://localhost:5678                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# 设置企业版模拟环境
setup_enterprise_mock() {
    log "设置企业版模拟功能..."

    # 确保企业版模拟环境变量已设置
    export N8N_ENTERPRISE_MOCK=${N8N_ENTERPRISE_MOCK:-true}
    export N8N_LICENSE_SERVER_URL=${N8N_LICENSE_SERVER_URL:-""}
    export N8N_LICENSE_AUTO_RENEW_ENABLED=${N8N_LICENSE_AUTO_RENEW_ENABLED:-false}

    # 设置中文界面
    export N8N_DEFAULT_LOCALE=${N8N_DEFAULT_LOCALE:-zh-CN}

    # 启用企业功能
    export N8N_SAML_ENABLED=${N8N_SAML_ENABLED:-true}
    export N8N_LDAP_ENABLED=${N8N_LDAP_ENABLED:-true}
    export N8N_LOG_STREAMING_ENABLED=${N8N_LOG_STREAMING_ENABLED:-true}
    export N8N_VARIABLES_ENABLED=${N8N_VARIABLES_ENABLED:-true}
    export N8N_SOURCE_CONTROL_ENABLED=${N8N_SOURCE_CONTROL_ENABLED:-true}
    export N8N_EXTERNAL_SECRETS_ENABLED=${N8N_EXTERNAL_SECRETS_ENABLED:-true}
    export N8N_WORKFLOW_HISTORY_ENABLED=${N8N_WORKFLOW_HISTORY_ENABLED:-true}

    success "企业版模拟功能已启用"
}

# 设置数据目录权限
setup_permissions() {
    log "设置数据目录权限..."

    # 确保数据目录存在且权限正确
    mkdir -p /home/node/.n8n
    chown -R node:node /home/node/.n8n 2>/dev/null || true

    success "数据目录权限设置完成"
}

# 显示环境信息
show_environment_info() {
    log "环境信息:"
    echo "  - N8N版本: ${N8N_VERSION:-unknown}"
    echo "  - 企业版模拟: ${N8N_ENTERPRISE_MOCK:-false}"
    echo "  - 默认语言: ${N8N_DEFAULT_LOCALE:-en}"
    echo "  - 节点环境: ${NODE_ENV:-production}"
    echo "  - 端口: ${N8N_PORT:-5678}"
}

# 主函数
main() {
    show_banner
    setup_enterprise_mock
    setup_permissions
    show_environment_info

    log "启动 N8N..."

    # 如果有参数传入，直接执行
    if [ $# -gt 0 ]; then
        exec "$@"
    else
        # 默认启动 N8N
        exec n8n start
    fi
}

# 执行主函数
main "$@" 