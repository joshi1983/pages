/* jshint browser: true */

const objWithNoProblem = {"0":"accent-color","1":"align-content","2":"align-items","3":"align-self","4":"alignment-baseline","5":"animation-composition","6":"animation-delay","7":"animation-direction","8":"animation-duration","9":"animation-fill-mode","10":"animation-iteration-count","11":"animation-name","12":"animation-play-state","13":"animation-range-end","14":"animation-range-start","15":"animation-timeline","16":"animation-timing-function","17":"app-region","18":"appearance","19":"backdrop-filter","20":"backface-visibility","21":"background-attachment","22":"background-blend-mode","23":"background-clip","24":"background-color","25":"background-image","26":"background-origin","27":"background-position","28":"background-repeat","29":"background-size","30":"baseline-shift","31":"baseline-source","32":"block-size","33":"border-block-end-color","34":"border-block-end-style","35":"border-block-end-width","36":"border-block-start-color","37":"border-block-start-style","38":"border-block-start-width","39":"border-bottom-color","40":"border-bottom-left-radius","41":"border-bottom-right-radius","42":"border-bottom-style","43":"border-bottom-width","44":"border-collapse","45":"border-end-end-radius","46":"border-end-start-radius","47":"border-image-outset","48":"border-image-repeat","49":"border-image-slice","50":"border-image-source","51":"border-image-width","52":"border-inline-end-color","53":"border-inline-end-style","54":"border-inline-end-width","55":"border-inline-start-color","56":"border-inline-start-style","57":"border-inline-start-width","58":"border-left-color","59":"border-left-style","60":"border-left-width","61":"border-right-color","62":"border-right-style","63":"border-right-width","64":"border-start-end-radius","65":"border-start-start-radius","66":"border-top-color","67":"border-top-left-radius","68":"border-top-right-radius","69":"border-top-style","70":"border-top-width","71":"bottom","72":"box-shadow","73":"box-sizing","74":"break-after","75":"break-before","76":"break-inside","77":"buffered-rendering","78":"caption-side","79":"caret-color","80":"clear","81":"clip","82":"clip-path","83":"clip-rule","84":"color","85":"color-interpolation","86":"color-interpolation-filters","87":"color-rendering","88":"column-count","89":"column-gap","90":"column-rule-color","91":"column-rule-style","92":"column-rule-width","93":"column-span","94":"column-width","95":"contain-intrinsic-block-size","96":"contain-intrinsic-height","97":"contain-intrinsic-inline-size","98":"contain-intrinsic-size","99":"contain-intrinsic-width","100":"container-name","101":"container-type","102":"content","103":"cursor","104":"cx","105":"cy","106":"d","107":"direction","108":"display","109":"dominant-baseline","110":"empty-cells","111":"fill","112":"fill-opacity","113":"fill-rule","114":"filter","115":"flex-basis","116":"flex-direction","117":"flex-grow","118":"flex-shrink","119":"flex-wrap","120":"float","121":"flood-color","122":"flood-opacity","123":"font-family","124":"font-kerning","125":"font-optical-sizing","126":"font-palette","127":"font-size","128":"font-stretch","129":"font-style","130":"font-synthesis-small-caps","131":"font-synthesis-style","132":"font-synthesis-weight","133":"font-variant","134":"font-variant-alternates","135":"font-variant-caps","136":"font-variant-east-asian","137":"font-variant-ligatures","138":"font-variant-numeric","139":"font-variant-position","140":"font-weight","141":"grid-auto-columns","142":"grid-auto-flow","143":"grid-auto-rows","144":"grid-column-end","145":"grid-column-start","146":"grid-row-end","147":"grid-row-start","148":"grid-template-areas","149":"grid-template-columns","150":"grid-template-rows","151":"height","152":"hyphenate-character","153":"hyphenate-limit-chars","154":"hyphens","155":"image-orientation","156":"image-rendering","157":"initial-letter","158":"inline-size","159":"inset-block-end","160":"inset-block-start","161":"inset-inline-end","162":"inset-inline-start","163":"isolation","164":"justify-content","165":"justify-items","166":"justify-self","167":"left","168":"letter-spacing","169":"lighting-color","170":"line-break","171":"line-height","172":"list-style-image","173":"list-style-position","174":"list-style-type","175":"margin-block-end","176":"margin-block-start","177":"margin-bottom","178":"margin-inline-end","179":"margin-inline-start","180":"margin-left","181":"margin-right","182":"margin-top","183":"marker-end","184":"marker-mid","185":"marker-start","186":"mask-clip","187":"mask-composite","188":"mask-image","189":"mask-mode","190":"mask-origin","191":"mask-position","192":"mask-repeat","193":"mask-size","194":"mask-type","195":"math-depth","196":"math-shift","197":"math-style","198":"max-block-size","199":"max-height","200":"max-inline-size","201":"max-width","202":"min-block-size","203":"min-height","204":"min-inline-size","205":"min-width","206":"mix-blend-mode","207":"object-fit","208":"object-position","209":"object-view-box","210":"offset-anchor","211":"offset-distance","212":"offset-path","213":"offset-position","214":"offset-rotate","215":"opacity","216":"order","217":"orphans","218":"outline-color","219":"outline-offset","220":"outline-style","221":"outline-width","222":"overflow-anchor","223":"overflow-clip-margin","224":"overflow-wrap","225":"overflow-x","226":"overflow-y","227":"overlay","228":"overscroll-behavior-block","229":"overscroll-behavior-inline","230":"padding-block-end","231":"padding-block-start","232":"padding-bottom","233":"padding-inline-end","234":"padding-inline-start","235":"padding-left","236":"padding-right","237":"padding-top","238":"paint-order","239":"perspective","240":"perspective-origin","241":"pointer-events","242":"position","243":"r","244":"resize","245":"right","246":"rotate","247":"row-gap","248":"ruby-position","249":"rx","250":"ry","251":"scale","252":"scroll-behavior","253":"scroll-margin-block-end","254":"scroll-margin-block-start","255":"scroll-margin-inline-end","256":"scroll-margin-inline-start","257":"scroll-padding-block-end","258":"scroll-padding-block-start","259":"scroll-padding-inline-end","260":"scroll-padding-inline-start","261":"scroll-timeline-axis","262":"scroll-timeline-name","263":"scrollbar-color","264":"scrollbar-gutter","265":"scrollbar-width","266":"shape-image-threshold","267":"shape-margin","268":"shape-outside","269":"shape-rendering","270":"speak","271":"stop-color","272":"stop-opacity","273":"stroke","274":"stroke-dasharray","275":"stroke-dashoffset","276":"stroke-linecap","277":"stroke-linejoin","278":"stroke-miterlimit","279":"stroke-opacity","280":"stroke-width","281":"tab-size","282":"table-layout","283":"text-align","284":"text-align-last","285":"text-anchor","286":"text-decoration","287":"text-decoration-color","288":"text-decoration-line","289":"text-decoration-skip-ink","290":"text-decoration-style","291":"text-emphasis-color","292":"text-emphasis-position","293":"text-emphasis-style","294":"text-indent","295":"text-overflow","296":"text-rendering","297":"text-shadow","298":"text-size-adjust","299":"text-transform","300":"text-underline-position","301":"text-wrap","302":"timeline-scope","303":"top","304":"touch-action","305":"transform","306":"transform-origin","307":"transform-style","308":"transition-behavior","309":"transition-delay","310":"transition-duration","311":"transition-property","312":"transition-timing-function","313":"translate","314":"unicode-bidi","315":"user-select","316":"vector-effect","317":"vertical-align","318":"view-timeline-axis","319":"view-timeline-inset","320":"view-timeline-name","321":"view-transition-name","322":"visibility","323":"white-space-collapse","324":"widows","325":"width","326":"will-change","327":"word-break","328":"word-spacing","329":"writing-mode","330":"x","331":"y","332":"z-index","333":"zoom","334":"-webkit-border-horizontal-spacing","335":"-webkit-border-image","336":"-webkit-border-vertical-spacing","337":"-webkit-box-align","338":"-webkit-box-decoration-break","339":"-webkit-box-direction","340":"-webkit-box-flex","341":"-webkit-box-ordinal-group","342":"-webkit-box-orient","343":"-webkit-box-pack","344":"-webkit-box-reflect","345":"-webkit-font-smoothing","346":"-webkit-line-break","347":"-webkit-line-clamp","348":"-webkit-locale","349":"-webkit-mask-box-image","350":"-webkit-mask-box-image-outset","351":"-webkit-mask-box-image-repeat","352":"-webkit-mask-box-image-slice","353":"-webkit-mask-box-image-source","354":"-webkit-mask-box-image-width","355":"-webkit-print-color-adjust","356":"-webkit-rtl-ordering","357":"-webkit-tap-highlight-color","358":"-webkit-text-combine","359":"-webkit-text-decorations-in-effect","360":"-webkit-text-fill-color","361":"-webkit-text-orientation","362":"-webkit-text-security","363":"-webkit-text-stroke-color","364":"-webkit-text-stroke-width","365":"-webkit-user-drag","366":"-webkit-user-modify","367":"-webkit-writing-mode","accentColor":"auto","additiveSymbols":"","alignContent":"normal","alignItems":"normal","alignSelf":"auto","alignmentBaseline":"auto","all":"","animation":"none 0s ease 0s 1 normal none running","animationComposition":"replace","animationDelay":"0s","animationDirection":"normal","animationDuration":"0s","animationFillMode":"none","animationIterationCount":"1","animationName":"none","animationPlayState":"running","animationRange":"normal","animationRangeEnd":"normal","animationRangeStart":"normal","animationTimeline":"auto","animationTimingFunction":"ease","appRegion":"none","appearance":"auto","ascentOverride":"","aspectRatio":"auto","backdropFilter":"none","backfaceVisibility":"visible","background":"rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box","backgroundAttachment":"scroll","backgroundBlendMode":"normal","backgroundClip":"border-box","backgroundColor":"rgba(0, 0, 0, 0)","backgroundImage":"none","backgroundOrigin":"padding-box","backgroundPosition":"0% 0%","backgroundPositionX":"0%","backgroundPositionY":"0%","backgroundRepeat":"repeat","backgroundSize":"auto","basePalette":"","baselineShift":"0px","baselineSource":"auto","blockSize":"701.7px","border":"0px solid rgb(118, 118, 118)","borderBlock":"0px solid rgb(118, 118, 118)","borderBlockColor":"rgb(118, 118, 118)","borderBlockEnd":"0px solid rgb(118, 118, 118)","borderBlockEndColor":"rgb(118, 118, 118)","borderBlockEndStyle":"solid","borderBlockEndWidth":"0px","borderBlockStart":"0px solid rgb(118, 118, 118)","borderBlockStartColor":"rgb(118, 118, 118)","borderBlockStartStyle":"solid","borderBlockStartWidth":"0px","borderBlockStyle":"solid","borderBlockWidth":"0px","borderBottom":"0px solid rgb(118, 118, 118)","borderBottomColor":"rgb(118, 118, 118)","borderBottomLeftRadius":"0px","borderBottomRightRadius":"0px","borderBottomStyle":"solid","borderBottomWidth":"0px","borderCollapse":"separate","borderColor":"rgb(118, 118, 118)","borderEndEndRadius":"0px","borderEndStartRadius":"0px","borderImage":"none","borderImageOutset":"0","borderImageRepeat":"stretch","borderImageSlice":"100%","borderImageSource":"none","borderImageWidth":"1","borderInline":"0px solid rgb(118, 118, 118)","borderInlineColor":"rgb(118, 118, 118)","borderInlineEnd":"0px solid rgb(118, 118, 118)","borderInlineEndColor":"rgb(118, 118, 118)","borderInlineEndStyle":"solid","borderInlineEndWidth":"0px","borderInlineStart":"0px solid rgb(118, 118, 118)","borderInlineStartColor":"rgb(118, 118, 118)","borderInlineStartStyle":"solid","borderInlineStartWidth":"0px","borderInlineStyle":"solid","borderInlineWidth":"0px","borderLeft":"0px solid rgb(118, 118, 118)","borderLeftColor":"rgb(118, 118, 118)","borderLeftStyle":"solid","borderLeftWidth":"0px","borderRadius":"0px","borderRight":"0px solid rgb(118, 118, 118)","borderRightColor":"rgb(118, 118, 118)","borderRightStyle":"solid","borderRightWidth":"0px","borderSpacing":"0px 0px","borderStartEndRadius":"0px","borderStartStartRadius":"0px","borderStyle":"solid","borderTop":"0px solid rgb(118, 118, 118)","borderTopColor":"rgb(118, 118, 118)","borderTopLeftRadius":"0px","borderTopRightRadius":"0px","borderTopStyle":"solid","borderTopWidth":"0px","borderWidth":"0px","bottom":"0px","boxShadow":"none","boxSizing":"border-box","breakAfter":"auto","breakBefore":"auto","breakInside":"auto","bufferedRendering":"auto","captionSide":"top","caretColor":"rgb(0, 0, 0)","clear":"none","clip":"auto","clipPath":"none","clipRule":"nonzero","color":"rgba(0, 0, 0, 0)","colorInterpolation":"srgb","colorInterpolationFilters":"linearrgb","colorRendering":"auto","colorScheme":"normal","columnCount":"auto","columnFill":"balance","columnGap":"normal","columnRule":"0px none rgba(0, 0, 0, 0)","columnRuleColor":"rgba(0, 0, 0, 0)","columnRuleStyle":"none","columnRuleWidth":"0px","columnSpan":"none","columnWidth":"auto","columns":"auto auto","contain":"none","containIntrinsicBlockSize":"none","containIntrinsicHeight":"none","containIntrinsicInlineSize":"none","containIntrinsicSize":"none","containIntrinsicWidth":"none","container":"none","containerName":"none","containerType":"normal","content":"normal","contentVisibility":"visible","counterIncrement":"none","counterReset":"none","counterSet":"none","cursor":"text","cx":"0px","cy":"0px","d":"none","descentOverride":"","direction":"ltr","display":"block","dominantBaseline":"auto","emptyCells":"show","fallback":"","fill":"rgb(0, 0, 0)","fillOpacity":"1","fillRule":"nonzero","filter":"none","flex":"0 1 auto","flexBasis":"auto","flexDirection":"row","flexFlow":"row nowrap","flexGrow":"0","flexShrink":"1","flexWrap":"nowrap","float":"none","floodColor":"rgb(0, 0, 0)","floodOpacity":"1","font":"13px / 13px monospace","fontDisplay":"","fontFamily":"monospace","fontFeatureSettings":"normal","fontKerning":"auto","fontOpticalSizing":"auto","fontPalette":"normal","fontSize":"13px","fontStretch":"100%","fontStyle":"normal","fontSynthesis":"weight style small-caps","fontSynthesisSmallCaps":"auto","fontSynthesisStyle":"auto","fontSynthesisWeight":"auto","fontVariant":"normal","fontVariantAlternates":"normal","fontVariantCaps":"normal","fontVariantEastAsian":"normal","fontVariantLigatures":"normal","fontVariantNumeric":"normal","fontVariantPosition":"normal","fontVariationSettings":"normal","fontWeight":"400","forcedColorAdjust":"auto","gap":"normal","grid":"none / none / none / row / auto / auto","gridArea":"auto","gridAutoColumns":"auto","gridAutoFlow":"row","gridAutoRows":"auto","gridColumn":"auto","gridColumnEnd":"auto","gridColumnGap":"normal","gridColumnStart":"auto","gridGap":"normal normal","gridRow":"auto","gridRowEnd":"auto","gridRowGap":"normal","gridRowStart":"auto","gridTemplate":"none","gridTemplateAreas":"none","gridTemplateColumns":"none","gridTemplateRows":"none","height":"701.7px","hyphenateCharacter":"auto","hyphenateLimitChars":"auto","hyphens":"manual","imageOrientation":"from-image","imageRendering":"auto","inherits":"","initialLetter":"normal","initialValue":"","inlineSize":"896.4px","inset":"0px 2.2px 0px 55.8px","insetBlock":"0px","insetBlockEnd":"0px","insetBlockStart":"0px","insetInline":"55.8px 2.2px","insetInlineEnd":"2.2px","insetInlineStart":"55.8px","isolation":"auto","justifyContent":"normal","justifyItems":"normal","justifySelf":"auto","left":"55.8px","letterSpacing":"normal","lightingColor":"rgb(255, 255, 255)","lineBreak":"auto","lineGapOverride":"","lineHeight":"13px","listStyle":"outside none disc","listStyleImage":"none","listStylePosition":"outside","listStyleType":"disc","margin":"0px","marginBlock":"0px","marginBlockEnd":"0px","marginBlockStart":"0px","marginBottom":"0px","marginInline":"0px","marginInlineEnd":"0px","marginInlineStart":"0px","marginLeft":"0px","marginRight":"0px","marginTop":"0px","marker":"none","markerEnd":"none","markerMid":"none","markerStart":"none","mask":"none","maskClip":"border-box","maskComposite":"add","maskImage":"none","maskMode":"match-source","maskOrigin":"border-box","maskPosition":"0% 0%","maskRepeat":"repeat","maskSize":"auto","maskType":"luminance","mathDepth":"0","mathShift":"normal","mathStyle":"normal","maxBlockSize":"none","maxHeight":"none","maxInlineSize":"none","maxWidth":"none","minBlockSize":"0px","minHeight":"0px","minInlineSize":"481px","minWidth":"481px","mixBlendMode":"normal","negative":"","objectFit":"fill","objectPosition":"50% 50%","objectViewBox":"none","offset":"none 0px auto 0deg","offsetAnchor":"auto","offsetDistance":"0px","offsetPath":"none","offsetPosition":"normal","offsetRotate":"auto 0deg","opacity":"1","order":"0","orphans":"2","outline":"rgb(16, 16, 16) auto 0.8px","outlineColor":"rgb(16, 16, 16)","outlineOffset":"0px","outlineStyle":"auto","outlineWidth":"0.8px","overflow":"hidden","overflowAnchor":"auto","overflowClipMargin":"0px","overflowWrap":"normal","overflowX":"hidden","overflowY":"hidden","overlay":"none","overrideColors":"","overscrollBehavior":"auto","overscrollBehaviorBlock":"auto","overscrollBehaviorInline":"auto","overscrollBehaviorX":"auto","overscrollBehaviorY":"auto","pad":"","padding":"0px 2px 2px","paddingBlock":"0px 2px","paddingBlockEnd":"2px","paddingBlockStart":"0px","paddingBottom":"2px","paddingInline":"2px","paddingInlineEnd":"2px","paddingInlineStart":"2px","paddingLeft":"2px","paddingRight":"2px","paddingTop":"0px","page":"auto","pageBreakAfter":"auto","pageBreakBefore":"auto","pageBreakInside":"auto","pageOrientation":"","paintOrder":"normal","perspective":"none","perspectiveOrigin":"448.2px 350.85px","placeContent":"normal","placeItems":"normal","placeSelf":"auto","pointerEvents":"auto","position":"absolute","prefix":"","quotes":"auto","r":"0px","range":"","resize":"none","right":"2.2px","rotate":"none","rowGap":"normal","rubyPosition":"over","rx":"auto","ry":"auto","scale":"none","scrollBehavior":"auto","scrollMargin":"0px","scrollMarginBlock":"0px","scrollMarginBlockEnd":"0px","scrollMarginBlockStart":"0px","scrollMarginBottom":"0px","scrollMarginInline":"0px","scrollMarginInlineEnd":"0px","scrollMarginInlineStart":"0px","scrollMarginLeft":"0px","scrollMarginRight":"0px","scrollMarginTop":"0px","scrollPadding":"auto","scrollPaddingBlock":"auto","scrollPaddingBlockEnd":"auto","scrollPaddingBlockStart":"auto","scrollPaddingBottom":"auto","scrollPaddingInline":"auto","scrollPaddingInlineEnd":"auto","scrollPaddingInlineStart":"auto","scrollPaddingLeft":"auto","scrollPaddingRight":"auto","scrollPaddingTop":"auto","scrollSnapAlign":"none","scrollSnapStop":"normal","scrollSnapType":"none","scrollTimeline":"none","scrollTimelineAxis":"block","scrollTimelineName":"none","scrollbarColor":"auto","scrollbarGutter":"auto","scrollbarWidth":"auto","shapeImageThreshold":"0","shapeMargin":"0px","shapeOutside":"none","shapeRendering":"auto","size":"","sizeAdjust":"","speak":"normal","speakAs":"","src":"","stopColor":"rgb(0, 0, 0)","stopOpacity":"1","stroke":"none","strokeDasharray":"none","strokeDashoffset":"0px","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeOpacity":"1","strokeWidth":"1px","suffix":"","symbols":"","syntax":"","system":"","tabSize":"4","tableLayout":"auto","textAlign":"start","textAlignLast":"auto","textAnchor":"start","textCombineUpright":"none","textDecoration":"none solid rgba(0, 0, 0, 0)","textDecorationColor":"rgba(0, 0, 0, 0)","textDecorationLine":"none","textDecorationSkipInk":"auto","textDecorationStyle":"solid","textDecorationThickness":"auto","textEmphasis":"none rgba(0, 0, 0, 0)","textEmphasisColor":"rgba(0, 0, 0, 0)","textEmphasisPosition":"over","textEmphasisStyle":"none","textIndent":"0px","textOrientation":"mixed","textOverflow":"clip","textRendering":"auto","textShadow":"none","textSizeAdjust":"auto","textTransform":"none","textUnderlineOffset":"auto","textUnderlinePosition":"auto","textWrap":"nowrap","timelineScope":"none","top":"0px","touchAction":"auto","transform":"none","transformBox":"view-box","transformOrigin":"448.2px 350.85px","transformStyle":"flat","transition":"all 0s ease 0s","transitionBehavior":"normal","transitionDelay":"0s","transitionDuration":"0s","transitionProperty":"all","transitionTimingFunction":"ease","translate":"none","unicodeBidi":"normal","unicodeRange":"","userSelect":"auto","vectorEffect":"none","verticalAlign":"baseline","viewTimeline":"none","viewTimelineAxis":"block","viewTimelineInset":"auto","viewTimelineName":"none","viewTransitionName":"none","visibility":"visible","webkitAlignContent":"normal","webkitAlignItems":"normal","webkitAlignSelf":"auto","webkitAnimation":"none 0s ease 0s 1 normal none running","webkitAnimationDelay":"0s","webkitAnimationDirection":"normal","webkitAnimationDuration":"0s","webkitAnimationFillMode":"none","webkitAnimationIterationCount":"1","webkitAnimationName":"none","webkitAnimationPlayState":"running","webkitAnimationTimingFunction":"ease","webkitAppRegion":"none","webkitAppearance":"auto","webkitBackfaceVisibility":"visible","webkitBackgroundClip":"border-box","webkitBackgroundOrigin":"padding-box","webkitBackgroundSize":"auto","webkitBorderAfter":"0px solid rgb(118, 118, 118)","webkitBorderAfterColor":"rgb(118, 118, 118)","webkitBorderAfterStyle":"solid","webkitBorderAfterWidth":"0px","webkitBorderBefore":"0px solid rgb(118, 118, 118)","webkitBorderBeforeColor":"rgb(118, 118, 118)","webkitBorderBeforeStyle":"solid","webkitBorderBeforeWidth":"0px","webkitBorderBottomLeftRadius":"0px","webkitBorderBottomRightRadius":"0px","webkitBorderEnd":"0px solid rgb(118, 118, 118)","webkitBorderEndColor":"rgb(118, 118, 118)","webkitBorderEndStyle":"solid","webkitBorderEndWidth":"0px","webkitBorderHorizontalSpacing":"0px","webkitBorderImage":"none","webkitBorderRadius":"0px","webkitBorderStart":"0px solid rgb(118, 118, 118)","webkitBorderStartColor":"rgb(118, 118, 118)","webkitBorderStartStyle":"solid","webkitBorderStartWidth":"0px","webkitBorderTopLeftRadius":"0px","webkitBorderTopRightRadius":"0px","webkitBorderVerticalSpacing":"0px","webkitBoxAlign":"stretch","webkitBoxDecorationBreak":"slice","webkitBoxDirection":"normal","webkitBoxFlex":"0","webkitBoxOrdinalGroup":"1","webkitBoxOrient":"horizontal","webkitBoxPack":"start","webkitBoxReflect":"none","webkitBoxShadow":"none","webkitBoxSizing":"border-box","webkitClipPath":"none","webkitColumnBreakAfter":"auto","webkitColumnBreakBefore":"auto","webkitColumnBreakInside":"auto","webkitColumnCount":"auto","webkitColumnGap":"normal","webkitColumnRule":"0px none rgba(0, 0, 0, 0)","webkitColumnRuleColor":"rgba(0, 0, 0, 0)","webkitColumnRuleStyle":"none","webkitColumnRuleWidth":"0px","webkitColumnSpan":"none","webkitColumnWidth":"auto","webkitColumns":"auto auto","webkitFilter":"none","webkitFlex":"0 1 auto","webkitFlexBasis":"auto","webkitFlexDirection":"row","webkitFlexFlow":"row nowrap","webkitFlexGrow":"0","webkitFlexShrink":"1","webkitFlexWrap":"nowrap","webkitFontFeatureSettings":"normal","webkitFontSmoothing":"auto","webkitHyphenateCharacter":"auto","webkitJustifyContent":"normal","webkitLineBreak":"auto","webkitLineClamp":"none","webkitLocale":"\"en\"","webkitLogicalHeight":"701.7px","webkitLogicalWidth":"896.4px","webkitMarginAfter":"0px","webkitMarginBefore":"0px","webkitMarginEnd":"0px","webkitMarginStart":"0px","webkitMask":"none","webkitMaskBoxImage":"none","webkitMaskBoxImageOutset":"0","webkitMaskBoxImageRepeat":"stretch","webkitMaskBoxImageSlice":"0 fill","webkitMaskBoxImageSource":"none","webkitMaskBoxImageWidth":"auto","webkitMaskClip":"border-box","webkitMaskComposite":"add","webkitMaskImage":"none","webkitMaskOrigin":"border-box","webkitMaskPosition":"0% 0%","webkitMaskPositionX":"0%","webkitMaskPositionY":"0%","webkitMaskRepeat":"repeat","webkitMaskSize":"auto","webkitMaxLogicalHeight":"none","webkitMaxLogicalWidth":"none","webkitMinLogicalHeight":"0px","webkitMinLogicalWidth":"481px","webkitOpacity":"1","webkitOrder":"0","webkitPaddingAfter":"2px","webkitPaddingBefore":"0px","webkitPaddingEnd":"2px","webkitPaddingStart":"2px","webkitPerspective":"none","webkitPerspectiveOrigin":"448.2px 350.85px","webkitPerspectiveOriginX":"","webkitPerspectiveOriginY":"","webkitPrintColorAdjust":"economy","webkitRtlOrdering":"logical","webkitRubyPosition":"before","webkitShapeImageThreshold":"0","webkitShapeMargin":"0px","webkitShapeOutside":"none","webkitTapHighlightColor":"rgba(0, 0, 0, 0.18)","webkitTextCombine":"none","webkitTextDecorationsInEffect":"none","webkitTextEmphasis":"none rgba(0, 0, 0, 0)","webkitTextEmphasisColor":"rgba(0, 0, 0, 0)","webkitTextEmphasisPosition":"over","webkitTextEmphasisStyle":"none","webkitTextFillColor":"rgba(0, 0, 0, 0)","webkitTextOrientation":"vertical-right","webkitTextSecurity":"none","webkitTextSizeAdjust":"auto","webkitTextStroke":"","webkitTextStrokeColor":"rgba(0, 0, 0, 0)","webkitTextStrokeWidth":"0px","webkitTransform":"none","webkitTransformOrigin":"448.2px 350.85px","webkitTransformOriginX":"","webkitTransformOriginY":"","webkitTransformOriginZ":"","webkitTransformStyle":"flat","webkitTransition":"all 0s ease 0s","webkitTransitionDelay":"0s","webkitTransitionDuration":"0s","webkitTransitionProperty":"all","webkitTransitionTimingFunction":"ease","webkitUserDrag":"auto","webkitUserModify":"read-only","webkitUserSelect":"auto","webkitWritingMode":"horizontal-tb","whiteSpace":"pre","whiteSpaceCollapse":"preserve","widows":"2","width":"896.4px","willChange":"auto","wordBreak":"normal","wordSpacing":"0px","wordWrap":"normal","writingMode":"horizontal-tb","x":"0px","y":"0px","zIndex":"auto","zoom":"1","cssText":"","length":368,"parentRule":null,"cssFloat":"none"};
function logJSON(obj) {
	const dto = {};
	const noProbDTO = {};
	for (let key in obj) {
		if (typeof obj[key] !== 'function') {
			if (obj[key] === objWithNoProblem[key])
				continue;
			dto[key] = obj[key];
			noProbDTO[key] = objWithNoProblem[key];
		}
	}
	console.log('differences' + JSON.stringify(dto) + ', objWithNoProblem = ' + JSON.stringify(noProbDTO));
}

(function () {

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if (el) el.parentNode.removeChild(el);
  }

  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
  var isInput = element.nodeName === 'INPUT';

	logJSON(computed);

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput)
    style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      if (computed.boxSizing === "border-box") {
        var height = parseInt(computed.height);
        var outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth);
        var targetHeight = outerHeight + parseInt(computed.lineHeight);
        if (height > targetHeight) {
          style.lineHeight = height - outerHeight + "px";
        } else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight;
        } else {
          style.lineHeight = 0;
        }
      } else {
        style.lineHeight = computed.height;
      }
    } else {
      style[prop] = computed[prop];
    }
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput)
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser) {
  window.getCaretCoordinates = getCaretCoordinates;
}

}());
