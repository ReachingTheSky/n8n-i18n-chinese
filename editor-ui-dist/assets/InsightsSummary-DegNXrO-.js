import { d as defineComponent, U as useRoute, a0 as useCssModule, x as computed, c as useI18n, V as VIEWS, h as resolveComponent, i as createElementBlock, g as openBlock, k as createBaseVNode, F as Fragment, G as renderList, j as createVNode, w as withCtx, m as unref, l as createTextVNode, t as toDisplayString, n as normalizeClass, gZ as TIME_RANGE_LABELS, f as createCommentVNode, g_ as INSIGHT_IMPACT_TYPES, am as useTelemetry, g$ as INSIGHTS_UNIT_IMPACT_MAPPING, _ as _export_sfc } from "./index-Y0sphpVt.js";
const smartDecimal = (value, decimals = 2) => {
  if (Number.isInteger(value)) {
    return value;
  }
  if (value.toString().split(".")[1].length <= decimals) {
    return value;
  }
  return Number(value.toFixed(decimals));
};
const _hoisted_1 = { "data-test-id": "insights-summary-tabs" };
const _hoisted_2 = ["data-test-id"];
const _hoisted_3 = ["href"];
const _hoisted_4 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsightsSummary",
  props: {
    summary: {},
    timeRange: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const i18n = useI18n();
    const route = useRoute();
    const $style = useCssModule();
    const telemetry = useTelemetry();
    const summaryTitles = computed(() => ({
      total: i18n.baseText("insights.banner.title.total"),
      failed: i18n.baseText("insights.banner.title.failed"),
      failureRate: i18n.baseText("insights.banner.title.failureRate"),
      timeSaved: i18n.baseText("insights.banner.title.timeSaved"),
      averageRunTime: i18n.baseText("insights.banner.title.averageRunTime")
    }));
    const summaryHasNoData = computed(() => {
      const summaryValues = Object.values(props.summary);
      return summaryValues.length > 0 && summaryValues.every((summary) => !summary.value);
    });
    const summaryWithRouteLocations = computed(
      () => props.summary.map((s) => ({
        ...s,
        to: { name: VIEWS.INSIGHTS, params: { insightType: s.id }, query: route.query }
      }))
    );
    const getImpactStyle = (id, value) => {
      const impact = INSIGHTS_UNIT_IMPACT_MAPPING[id];
      if (value === 0 || impact === INSIGHT_IMPACT_TYPES.NEUTRAL) {
        return $style.neutral;
      }
      if (impact === INSIGHT_IMPACT_TYPES.POSITIVE) {
        return value > 0 ? $style.positive : $style.negative;
      }
      if (impact === INSIGHT_IMPACT_TYPES.NEGATIVE) {
        return value < 0 ? $style.positive : $style.negative;
      }
      return $style.neutral;
    };
    const trackTabClick = (insightType) => {
      telemetry.track(`User clicked ${summaryTitles.value[insightType]}`, {
        referrer: route.name === VIEWS.INSIGHTS ? "Dashboard" : "Overview"
      });
    };
    return (_ctx, _cache) => {
      const _component_i18n_t = resolveComponent("i18n-t");
      const _component_N8nTooltip = resolveComponent("N8nTooltip");
      const _component_N8nIcon = resolveComponent("N8nIcon");
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref($style).insights)
      }, [
        createBaseVNode("ul", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(summaryWithRouteLocations.value, ({ id, value, deviation, deviationUnit, unit, to }) => {
            return openBlock(), createElementBlock("li", {
              key: id,
              "data-test-id": `insights-summary-tab-${id}`
            }, [
              createVNode(_component_N8nTooltip, {
                placement: "top",
                disabled: !(summaryHasNoData.value && id === "total")
              }, {
                content: withCtx(() => [
                  createVNode(_component_i18n_t, { keypath: "insights.banner.noData.tooltip" }, {
                    link: withCtx(() => [
                      createBaseVNode("a", {
                        href: unref(i18n).baseText("insights.banner.noData.tooltip.link.url"),
                        target: "_blank"
                      }, toDisplayString(unref(i18n).baseText("insights.banner.noData.tooltip.link")), 9, _hoisted_3)
                    ]),
                    _: 1
                  })
                ]),
                default: withCtx(() => [
                  createVNode(_component_router_link, {
                    to,
                    "exact-active-class": unref($style).activeTab,
                    onClick: ($event) => trackTabClick(id)
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("strong", null, [
                        createVNode(_component_N8nTooltip, {
                          placement: "bottom",
                          disabled: id !== "timeSaved"
                        }, {
                          content: withCtx(() => [
                            createTextVNode(toDisplayString(unref(i18n).baseText("insights.banner.title.timeSaved.tooltip")), 1)
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" " + toDisplayString(summaryTitles.value[id]), 1)
                          ]),
                          _: 2
                        }, 1032, ["disabled"])
                      ]),
                      createBaseVNode("small", {
                        class: normalizeClass(unref($style).days)
                      }, toDisplayString(unref(TIME_RANGE_LABELS)[_ctx.timeRange]), 3),
                      value === 0 && id === "timeSaved" ? (openBlock(), createElementBlock("span", {
                        key: 0,
                        class: normalizeClass(unref($style).empty)
                      }, [
                        _cache[0] || (_cache[0] = createBaseVNode("em", null, "--", -1)),
                        createBaseVNode("small", null, [
                          createVNode(_component_N8nTooltip, { placement: "bottom" }, {
                            content: withCtx(() => [
                              createVNode(_component_i18n_t, { keypath: "insights.banner.timeSaved.tooltip" }, {
                                link: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(i18n).baseText("insights.banner.timeSaved.tooltip.link.text")), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_N8nIcon, {
                                class: normalizeClass(unref($style).icon),
                                icon: "info-circle"
                              }, null, 8, ["class"])
                            ]),
                            _: 1
                          })
                        ])
                      ], 2)) : (openBlock(), createElementBlock("span", _hoisted_4, [
                        createBaseVNode("em", null, [
                          createTextVNode(toDisplayString(unref(smartDecimal)(value).toLocaleString("en-US")) + " ", 1),
                          createBaseVNode("i", null, toDisplayString(unit), 1)
                        ]),
                        deviation !== null ? (openBlock(), createElementBlock("small", {
                          key: 0,
                          class: normalizeClass(getImpactStyle(id, deviation))
                        }, [
                          createVNode(_component_N8nIcon, {
                            class: normalizeClass([unref($style).icon, getImpactStyle(id, deviation)]),
                            icon: deviation === 0 ? "caret-right" : deviation > 0 ? "caret-up" : "caret-down"
                          }, null, 8, ["class", "icon"]),
                          createVNode(_component_N8nTooltip, {
                            placement: "bottom",
                            disabled: id !== "failureRate"
                          }, {
                            content: withCtx(() => [
                              createTextVNode(toDisplayString(unref(i18n).baseText("insights.banner.failureRate.deviation.tooltip")), 1)
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" " + toDisplayString(unref(smartDecimal)(Math.abs(deviation)).toLocaleString("en-US")) + toDisplayString(deviationUnit), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled"])
                        ], 2)) : createCommentVNode("", true)
                      ]))
                    ]),
                    _: 2
                  }, 1032, ["to", "exact-active-class", "onClick"])
                ]),
                _: 2
              }, 1032, ["disabled"])
            ], 8, _hoisted_2);
          }), 128))
        ])
      ], 2);
    };
  }
});
const insights = "_insights_14hot_123";
const activeTab = "_activeTab_14hot_161";
const days = "_days_14hot_174";
const empty = "_empty_14hot_185";
const icon = "_icon_14hot_196";
const noData = "_noData_14hot_228";
const positive = "_positive_14hot_233";
const negative = "_negative_14hot_237";
const neutral = "_neutral_14hot_241";
const loading = "_loading_14hot_256";
const style0 = {
  insights,
  activeTab,
  days,
  empty,
  icon,
  noData,
  positive,
  negative,
  neutral,
  loading
};
const cssModules = {
  "$style": style0
};
const InsightsSummary = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  InsightsSummary as I,
  smartDecimal as s
};
