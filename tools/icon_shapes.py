"""Geometry for the rendered icon set.

Bodies use two placeholders the builder resolves:
    {g:material}  -> url(#grad-material)   fill with that material's gradient
    {f:material}  -> url(#lit-material)    run that material's lighting rig

Anything drawn outside an {f:...} group is unlit detail — eyes, seams,
lettering — which should stay flat so it reads at 19px.
Canvas is 68x64 to match the existing set.
"""

SHADOW = '<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#000" opacity="{op}" filter="url(#cast)"/>'

ICONS = {}

# ── metal ───────────────────────────────────────────────────────────────────
ICONS['bell'] = ('gold', 16, 56.5, 16, 3, .45, '''
<g filter="{f:gold}"><path d="M32 7c-1.9 0-3.4 1.5-3.4 3.4v1.3C22 13.2 17.6 19 17.6 25.9v11.4l-3.9 6.4c-.9 1.5.2 3.4 2 3.4h36.6c1.8 0 2.9-1.9 2-3.4l-3.9-6.4V25.9C50.4 19 46 13.2 39.4 11.7v-1.3C39.4 8.5 37.9 7 36 7z
M27 48.5a7 7 0 0 0 14 0z" fill="{g:gold}"/></g>''')

ICONS['bell-off'] = ('gold', 16, 56.5, 16, 3, .45, ICONS['bell'][6] + '''
<path d="M12 9 56 53" stroke="#FFFFFF" stroke-width="7.5" stroke-linecap="round" opacity=".92"/>
<path d="M12 9 56 53" stroke="#C0392B" stroke-width="4.4" stroke-linecap="round"/>''')

ICONS['star'] = ('gold', 17, 57, 15, 2.8, .42, '''
<g filter="{f:gold}"><path d="M34 5 41.8 22.6 61 24.8 46.6 37.6 50.6 56.4 34 46.8 17.4 56.4 21.4 37.6 7 24.8 26.2 22.6z" fill="{g:gold}"/></g>''')

ICONS['ticket'] = ('gold', 19, 55, 19, 2.8, .4, '''
<g filter="{f:gold}"><path d="M11 17h30a5 5 0 0 0 10 0h6a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4h-6a5 5 0 0 0-10 0H11a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4z" fill="{g:gold}"/></g>
<path d="M46 22.5v21" stroke="#7A5400" stroke-width="1.7" stroke-dasharray="3 3.6" stroke-linecap="round" opacity=".8"/>''')

ICONS['gear'] = ('graphite', 0, 57, 17, 2.8, .4, '__GEAR__')

ICONS['trash'] = ('graphite', 0, 58, 15, 2.6, .4, '''
<g filter="{f:graphite}"><path d="M15 21h38l-2.7 34.4a5 5 0 0 1-5 4.6H22.7a5 5 0 0 1-5-4.6z" fill="{g:graphite}"/>
<rect x="11" y="12.5" width="46" height="8.5" rx="4.2" fill="{g:graphite}"/>
<path d="M26.5 8.5h15a2 2 0 0 1 2 2v2h-19v-2a2 2 0 0 1 2-2z" fill="{g:graphite}"/></g>
<path d="M26 30v21M34 30v21M42 30v21" stroke="#0E1220" stroke-width="2" opacity=".38" stroke-linecap="round"/>''')

ICONS['satellite'] = ('graphite', 0, 59, 13, 2.4, .38, '''
<g filter="{f:graphite}"><path d="M20 27h28v6H20z" fill="{g:graphite}"/>
<rect x="25" y="19" width="18" height="22" rx="4" fill="{g:graphite}"/>
<path d="M31.5 41h5v6h-5z" fill="{g:graphite}"/>
<path d="M34 45c-7 0-12 3.4-12 7.4S27 58 34 58s12-1.6 12-5.6S41 45 34 45z" fill="{g:graphite}"/></g>
<g filter="{f:glass}"><rect x="2" y="20" width="18" height="20" rx="2.5" fill="{g:glass}"/>
<rect x="48" y="20" width="18" height="20" rx="2.5" fill="{g:glass}"/></g>
<g stroke="#0B2E58" stroke-width="1.1" opacity=".45">
<path d="M11 20v20M2 30h18M57 20v20M48 30h18"/></g>''')

# ── violet / teal plastics ──────────────────────────────────────────────────
ICONS['bag'] = ('violet', 0, 58, 17, 3, .45, '''
<g filter="{f:violet}"><path d="M14 20h40l-3.6 33.4a4 4 0 0 1-4 3.6H21.6a4 4 0 0 1-4-3.6z" fill="{g:violet}"/></g>
<g filter="{f:violet}"><path d="M23 21v-4a11 11 0 0 1 22 0v4" fill="none" stroke="#C99BEF" stroke-width="3.6" stroke-linecap="round"/></g>''')

ICONS['pin'] = ('violet', 0, 57.5, 8, 2.6, .45, '''
<g filter="{f:violet}"><path d="M34 4c-9.6 0-17.4 7.8-17.4 17.4 0 12.6 14.6 28.6 15.8 30a2.1 2.1 0 0 0 3.2 0c1.2-1.4 15.8-17.4 15.8-30C51.4 11.8 43.6 4 34 4z" fill="{g:violet}"/></g>
<g filter="{f:gold}"><circle cx="34" cy="20.6" r="6.6" fill="{g:gold}"/></g>''')

ICONS['speaker'] = ('violet', 0, 57, 12, 2.4, .38, '''
<g filter="{f:violet}"><path d="M6 24h11L31 11v41L17 40H6z" fill="{g:violet}"/></g>
<g filter="{f:teal}"><path d="M39 22a13.5 13.5 0 0 1 0 20" fill="none" stroke="{g:teal}" stroke-width="4.2" stroke-linecap="round"/>
<path d="M48 14a25 25 0 0 1 0 36" fill="none" stroke="{g:teal}" stroke-width="4.2" stroke-linecap="round" opacity=".72"/></g>''')

ICONS['refresh'] = ('teal', 0, 58, 15, 2.6, .36, '''
<g filter="{f:teal}"><path d="M11 34A23 23 0 0 1 45 15.5" fill="none" stroke="{g:teal}" stroke-width="6.4" stroke-linecap="round"/>
<path d="M38.5 4.5 55 15 36 22.5z" fill="{g:teal}"/>
<g transform="rotate(180 34 30)"><path d="M11 34A23 23 0 0 1 45 15.5" fill="none" stroke="{g:teal}" stroke-width="6.4" stroke-linecap="round"/>
<path d="M38.5 4.5 55 15 36 22.5z" fill="{g:teal}"/></g></g>''')

ICONS['sparkle'] = ('teal', 0, 58, 12, 2.2, .3, '''
<g filter="{f:teal}"><path d="M34 5c2.7 12.8 8.9 20.6 21.7 23.3C42.9 31 36.7 38.2 34 51 31.3 38.2 25.1 31 12.3 28.3 25.1 25.6 31.3 17.8 34 5z" fill="{g:teal}"/></g>
<g filter="{f:gold}"><circle cx="55" cy="11" r="4" fill="{g:gold}"/><circle cx="13" cy="49" r="2.8" fill="{g:gold}"/></g>''')

ICONS['comet'] = ('gold', 0, 0, 0, 0, 0, '''
<g filter="{f:gold}"><path d="M40 26C30 34 18 44 5 56c16-6 29-14 39-23z" fill="{g:gold}"/></g>
<g filter="{f:gold}"><path d="M43 5c2.4 10.4 6.8 15.1 17.2 17.2C49.8 24.4 45.4 29 43 39.4 40.6 29 36.2 24.4 25.8 22.2 36.2 20.1 40.6 15.4 43 5z" fill="{g:gold}"/></g>
<circle cx="20" cy="14" r="2.4" fill="#7CEDE0" opacity=".85"/>
<circle cx="58" cy="46" r="1.9" fill="#C99BEF" opacity=".8"/>''')

ICONS['globe'] = ('teal', 0, 58, 16, 2.8, .42, '''
<g filter="{f:teal}"><circle cx="34" cy="30" r="25" fill="{g:teal}"/></g>
<g opacity=".55"><path d="M13 22c5 1.6 7-1 11 .6s3 6 7 6.4 6-3.4 10-2.6 5 4 9 3.4" fill="none" stroke="#CFFBD6" stroke-width="4.6" stroke-linecap="round"/>
<path d="M20 43c4-2.4 7 .6 11-.4s6-3.4 10-2" fill="none" stroke="#CFFBD6" stroke-width="4" stroke-linecap="round"/></g>
<g opacity=".45" fill="none" stroke="#EAFFFD" stroke-width="1.3">
<ellipse cx="34" cy="30" rx="11" ry="25"/><path d="M9.4 30h49.2M12 19h44M12 41h44"/></g>''')

ICONS['search'] = ('glass', 0, 58, 14, 2.4, .38, '''
<g filter="{f:violet}"><path d="M41 41 56 56" stroke="{g:violet}" stroke-width="7.5" stroke-linecap="round" fill="none"/></g>
<g filter="{f:glass}"><circle cx="27" cy="27" r="19" fill="{g:glass}" opacity=".92"/></g>
<g filter="{f:violet}"><circle cx="27" cy="27" r="20.6" fill="none" stroke="{g:violet}" stroke-width="4.6"/></g>''')

ICONS['phone'] = ('graphite', 0, 60, 12, 2.2, .38, '''
<g filter="{f:graphite}"><rect x="19" y="3" width="30" height="57" rx="6.5" fill="{g:graphite}"/></g>
<g filter="{f:glass}"><rect x="22.6" y="10" width="22.8" height="41" rx="2.6" fill="{g:glass}"/></g>
<rect x="30" y="6.4" width="8" height="2" rx="1" fill="#0E1220" opacity=".55"/>''')

# ── porcelain / paper / cloth ───────────────────────────────────────────────
ICONS['clock'] = ('gold', 15, 57, 15, 2.6, .4, '''
<g filter="{f:gold}"><circle cx="34" cy="30" r="25" fill="{g:gold}"/></g>
<g filter="{f:paper}"><circle cx="34" cy="30" r="20" fill="{g:paper}"/></g>
<path d="M34 14.5v2.2M49.5 30h-2.2M34 45.5v-2.2M18.5 30h2.2" stroke="#8A6A2E" stroke-width="2" stroke-linecap="round" opacity=".7"/>
<path d="M34 30V18.5" stroke="#2A1B46" stroke-width="3.2" stroke-linecap="round"/>
<path d="M34 30l9.5 5.5" stroke="#2A1B46" stroke-width="2.8" stroke-linecap="round"/>
<circle cx="34" cy="30" r="2.2" fill="#2A1B46"/>''')

ICONS['mail'] = ('paper', 0, 55, 18, 2.6, .4, '''
<g filter="{f:paper}"><rect x="7" y="15" width="54" height="35" rx="5" fill="{g:paper}"/></g>
<path d="M7.6 47.8 26.5 32M60.4 47.8 41.5 32" fill="none" stroke="#B7A184" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
<g filter="{f:paper}"><path d="M7.6 17.6 34 37 60.4 17.6" fill="none" stroke="{g:paper}" stroke-width="4.4" stroke-linejoin="round"/></g>
<path d="M7.6 17.6 34 37 60.4 17.6" fill="none" stroke="#9B8465" stroke-width="1.4" stroke-linejoin="round" opacity=".85"/>''')

ICONS['letter'] = ('paper', 0, 56, 18, 2.6, .4, '''
<g filter="{f:paper}"><rect x="8" y="16" width="52" height="36" rx="5" fill="{g:paper}"/></g>
<path d="M8.5 19 34 38 59.5 19" fill="none" stroke="#9B8465" stroke-width="2" stroke-linejoin="round" opacity=".8"/>
<g filter="{f:rose}"><circle cx="34" cy="41" r="9.4" fill="{g:rose}"/></g>
<path d="M34 45c-3-2.2-5-4-5-6a2.6 2.6 0 0 1 5-1 2.6 2.6 0 0 1 5 1c0 2-2 3.8-5 6z" fill="#FFE0EC" opacity=".85"/>''')

ICONS['pen'] = ('violet', 0, 58, 14, 2.4, .34, '''
<g filter="{f:teal}"><path d="M10 56h48" stroke="{g:teal}" stroke-width="3.6" stroke-linecap="round" fill="none"/></g>
<g filter="{f:violet}"><path d="M50 6 62 18 32 46 20 50 24 38z" fill="{g:violet}"/></g>
<g filter="{f:gold}"><path d="M20 50 24 38 32 46z" fill="{g:gold}"/></g>''')

ICONS['tshirt'] = ('fabric', 0, 59, 17, 2.6, .38, '''
<g filter="{f:fabric}"><path d="M25 7 12 14 5 27l10 5.6 3.4-5.6V55a3 3 0 0 0 3 3h25.2a3 3 0 0 0 3-3V27l3.4 5.6L63 27l-7-13-13-7c-1.8 4.2-5 6.4-9 6.4S26.8 11.2 25 7z" fill="{g:fabric}"/></g>
<path d="M25 7c1.8 4.2 5 6.4 9 6.4S41.2 11.2 43 7" fill="none" stroke="#F2E2FF" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>''')

ICONS['cap'] = ('fabric', 0, 52, 16, 2.6, .38, '''
<g filter="{f:fabric}"><path d="M34 13c-12.4 0-22 7.6-22 17V36h44v-6c0-9.4-9.6-17-22-17z" fill="{g:fabric}"/>
<path d="M12 36h34c10.5 0 16 3.1 16 5.8S56.5 46.6 46 46.6H12z" fill="{g:fabric}"/></g>
<path d="M34 14v22" stroke="#EBD5FF" stroke-width="1.3" opacity=".55"/>''')

ICONS['jacket'] = ('stone', 0, 60, 17, 2.6, .38, '''
<g filter="{f:stone}"><path d="M26 5 11 12 6 30l9.5 4.2 3-6V56a3 3 0 0 0 3 3h25a3 3 0 0 0 3-3V28.2l3 6L62 30l-5-18-15-7-8 7.6z" fill="{g:stone}"/></g>
<path d="M26 5 34 20.6 42 5" fill="none" stroke="#D6DEF6" stroke-width="2.6" stroke-linejoin="round" opacity=".8"/>
<g filter="{f:gold}"><circle cx="34" cy="31" r="2.4" fill="{g:gold}"/><circle cx="34" cy="42" r="2.4" fill="{g:gold}"/></g>''')

# ── organic ─────────────────────────────────────────────────────────────────
ICONS['leaf'] = ('foliage', 0, 58, 14, 2.4, .34, '''
<g filter="{f:foliage}"><path d="M53 8C29 8 12 21 12 40c0 6 2 11 5 15C22 34 33 24 48 20 34 27 25 38 22 57c4 2 9 3 14 3 17 0 22-19 22-33 0-8-1-14-5-19z" fill="{g:foliage}"/></g>
<path d="M17 55C24 36 33 26 48 20" fill="none" stroke="#E4FFEE" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>''')

ICONS['blossom'] = ('rose', 0, 58, 13, 2.2, .32, '''
<g filter="{f:rose}"><g fill="{g:rose}">
<path d="M34 8c4.6 0 8.4 4.4 8.4 9.8S38.6 28 34 28s-8.4-4.8-8.4-10.2S29.4 8 34 8z"/>
<path d="M34 8c4.6 0 8.4 4.4 8.4 9.8S38.6 28 34 28s-8.4-4.8-8.4-10.2S29.4 8 34 8z" transform="rotate(72 34 30)"/>
<path d="M34 8c4.6 0 8.4 4.4 8.4 9.8S38.6 28 34 28s-8.4-4.8-8.4-10.2S29.4 8 34 8z" transform="rotate(144 34 30)"/>
<path d="M34 8c4.6 0 8.4 4.4 8.4 9.8S38.6 28 34 28s-8.4-4.8-8.4-10.2S29.4 8 34 8z" transform="rotate(216 34 30)"/>
<path d="M34 8c4.6 0 8.4 4.4 8.4 9.8S38.6 28 34 28s-8.4-4.8-8.4-10.2S29.4 8 34 8z" transform="rotate(288 34 30)"/>
</g></g>
<g filter="{f:gold}"><circle cx="34" cy="30" r="5.4" fill="{g:gold}"/></g>''')

ICONS['hibiscus'] = ('rose', 0, 58, 14, 2.4, .32, '''
<g filter="{f:rose}"><g fill="{g:rose}">
<ellipse cx="34" cy="17" rx="10" ry="13.5"/>
<ellipse cx="34" cy="17" rx="10" ry="13.5" transform="rotate(72 34 30)"/>
<ellipse cx="34" cy="17" rx="10" ry="13.5" transform="rotate(144 34 30)"/>
<ellipse cx="34" cy="17" rx="10" ry="13.5" transform="rotate(216 34 30)"/>
<ellipse cx="34" cy="17" rx="10" ry="13.5" transform="rotate(288 34 30)"/>
</g></g>
<g filter="{f:gold}"><path d="M34 30 47 47" stroke="{g:gold}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
<circle cx="47" cy="47" r="3" fill="{g:gold}"/><circle cx="34" cy="30" r="6.2" fill="{g:gold}"/></g>''')

ICONS['hand'] = ('skin', 0, 59, 13, 2.4, .34, '''
<g filter="{f:teal}"><circle cx="34" cy="30" r="19" fill="{g:teal}" opacity=".3"/></g>
<g filter="{f:skin}"><path d="M22 30V15a4 4 0 0 1 8 0v12V11a4 4 0 0 1 8 0v16V14a4 4 0 0 1 8 0v18l3-7a3.6 3.6 0 0 1 6.4 3L48 48c-2.6 6-7 9-14 9-8.4 0-14-5.6-14-14V22a4 4 0 0 1 8 0z" fill="{g:skin}"/></g>
<g filter="{f:teal}"><circle cx="33" cy="38" r="5" fill="{g:teal}" opacity=".8"/></g>''')

ICONS['dove'] = ('porcelain', 0, 57, 14, 2.4, .34, '''
<g filter="{f:porcelain}"><path d="M25 40C17 40 10 37 4.5 31.5c4.6 7 4.6 13.4 1.5 18.5 6.4-1.8 11.6-4.2 16-7.4z" fill="{g:porcelain}"/>
<path d="M50.6 10.6a7.8 7.8 0 0 1 6.1 12.7c1.5 5.7.4 12-3.4 17.1C46.9 49.2 35.4 53 24.4 51.5c-3.4-.5-5.1-2.5-4.7-5.7 1-8.2 5-15.4 11.4-20 3.7-2.6 7.6-4.2 11.4-4.7a7.8 7.8 0 0 1 8.1-10.5z" fill="{g:porcelain}"/>
<path d="M46 28C42 36 35 43.5 25.5 47c5.5-7 10-14 12.5-20 3-1.5 6.5-1.2 8 1z" fill="{g:porcelain}"/></g>
<path d="M56.6 19 64.4 21.3l-7.4 2.9z" fill="#E8A32A"/>
<path d="M56.6 19 64.4 21.3l-3.8 1.1z" fill="#FFD27A"/>
<circle cx="51.6" cy="17.2" r="1.9" fill="#1F2E63"/>
<circle cx="51.1" cy="16.6" r=".6" fill="#FFFFFF" opacity=".9"/>''')

ICONS['ghost'] = ('spectral', 0, 58, 13, 2.4, .28, '''
<g filter="{f:spectral}"><path d="M34 5c-10.6 0-19 8.4-19 19v29.6c0 1.7 2 2.5 3.2 1.3l4.4-4.6 4.5 4.8a2 2 0 0 0 2.9 0l4-4.3 4 4.3a2 2 0 0 0 2.9 0l4.5-4.8 4.4 4.6c1.2 1.2 3.2.4 3.2-1.3V24c0-10.6-8.4-19-19-19z" fill="{g:spectral}"/></g>
<ellipse cx="27" cy="25" rx="3.1" ry="4.3" fill="#3A2C63"/><ellipse cx="41" cy="25" rx="3.1" ry="4.3" fill="#3A2C63"/>
<ellipse cx="34" cy="36" rx="3.2" ry="4.4" fill="#3A2C63" opacity=".8"/>''')

ICONS['doll'] = ('rose', 0, 60, 14, 2.4, .36, '''
<g filter="{f:rose}"><path d="M34 4c-8.4 0-13.6 7.2-13.6 15.4 0 3.8.9 6.9 2.2 9.1C17 32.9 13.4 40.4 13.4 47.6 13.4 55.6 22.6 60 34 60s20.6-4.4 20.6-12.4c0-7.2-3.6-14.7-9.2-19.1 1.3-2.2 2.2-5.3 2.2-9.1C47.6 11.2 42.4 4 34 4z" fill="{g:rose}"/></g>
<g filter="{f:paper}"><path d="M34 34c9.6 0 16.4 5.6 18.6 13.6C50.6 55.6 43 59 34 59s-16.6-3.4-18.6-11.4C17.6 39.6 24.4 34 34 34z" fill="{g:paper}" opacity=".95"/></g>
<g filter="{f:skin}"><ellipse cx="34" cy="20" rx="10.2" ry="11" fill="{g:skin}"/></g>
<circle cx="30" cy="19" r="1.7" fill="#3A2C63"/><circle cx="38" cy="19" r="1.7" fill="#3A2C63"/>
<path d="M31.4 24.4a3.4 3.4 0 0 0 5.2 0" fill="none" stroke="#A5563F" stroke-width="1.3" stroke-linecap="round"/>
<g filter="{f:rose}"><circle cx="34" cy="46" r="5" fill="{g:rose}"/></g>''')

ICONS['candle'] = ('paper', 0, 59, 14, 2.6, .38, '''
<g filter="{f:paper}"><rect x="24" y="24" width="20" height="33" rx="4" fill="{g:paper}"/></g>
<g filter="{f:gold}"><path d="M34 6c5 6 8 10 8 14a8 8 0 0 1-16 0c0-4 3-8 8-14z" fill="{g:gold}"/></g>
<path d="M34 12c2.4 3.2 3.8 5.4 3.8 7.4a3.8 3.8 0 0 1-7.6 0c0-2 1.4-4.2 3.8-7.4z" fill="#FFFBE4" opacity=".92"/>''')

ICONS['meditate'] = ('violet', 0, 59, 22, 2.6, .34, '''
<g filter="{f:teal}"><circle cx="34" cy="33" r="24" fill="{g:teal}" opacity=".26"/></g>
<g filter="{f:violet}"><path d="M11 50.5c0-4.2 10.3-7 23-7s23 2.8 23 7-10.3 7.5-23 7.5-23-3.3-23-7.5z" fill="{g:violet}"/>
<path d="M34 23c-7.4 0-12.2 6-13.8 13.6-1 4.8-4.2 7.8-8.2 9.2 2.2 1.6 6.6 1.6 10-.6 3.2-2.1 5.2-5.2 6.2-8.2 1.4-4 3.4-5.8 5.8-5.8s4.4 1.8 5.8 5.8c1 3 3 6.1 6.2 8.2 3.4 2.2 7.8 2.2 10 .6-4-1.4-7.2-4.4-8.2-9.2C46.2 29 41.4 23 34 23z" fill="{g:violet}"/></g>
<g filter="{f:skin}"><path d="M34 4.6a8.4 8.4 0 0 1 4.6 15.4c2 1.2 3.4 3 4.2 5.2h-17.6c.8-2.2 2.2-4 4.2-5.2A8.4 8.4 0 0 1 34 4.6z" fill="{g:skin}"/></g>''')

# ── landscape / sky ─────────────────────────────────────────────────────────
ICONS['mountain'] = ('stone', 0, 58, 17, 2.4, .34, '''
<g filter="{f:stone}"><path d="M2 56 22 20l13 21 5-7 26 22z" fill="{g:stone}"/></g>
<g filter="{f:porcelain}"><path d="M22 20l7.6 12.3-4.6 1.9-3.6-2.6-4 2.8z" fill="{g:porcelain}"/>
<path d="M40 34l6.4 5.4-3.8 1.3-2.9-1.6-2.7 1.7z" fill="{g:porcelain}"/></g>''')

ICONS['desert'] = ('sand', 0, 0, 0, 0, 0, '''
<g filter="{f:gold}"><circle cx="45" cy="26" r="10.5" fill="{g:gold}"/></g>
<g filter="{f:sand}"><path d="M0 46c8-10 17-13 26-8 8 4.4 14 4 20-2 5-5 12-6 22-3v27H0z" fill="{g:sand}"/></g>
<g filter="{f:foliage}"><path d="M17 52V40a3.4 3.4 0 0 1 6.8 0v12z" fill="{g:foliage}"/>
<path d="M17 45h-3.8a2.8 2.8 0 0 0-2.8 2.8V52M23.8 42h3.6a2.8 2.8 0 0 1 2.8 2.8V49" fill="none" stroke="{g:foliage}" stroke-width="3.8" stroke-linecap="round"/></g>
<g filter="{f:sand}"><path d="M0 56c9-6 18-7 28-3s19 3 40-4v15H0z" fill="{g:sand}"/></g>''')

ICONS['cloud'] = ('porcelain', 0, 56, 18, 2.4, .28, '''
<g filter="{f:porcelain}"><path d="M14 50A12 12 0 0 1 14 26A15 15 0 0 1 42 20A17 17 0 0 1 54 50Z" fill="{g:porcelain}"/></g>''')

ICONS['warning'] = ('gold', 0, 58, 20, 2.6, .38, '''
<g filter="{f:gold}"><path d="M34 6c1.6 0 3.1.9 3.9 2.3l24 42.2c1.6 2.9-.5 6.5-3.9 6.5H10c-3.4 0-5.5-3.6-3.9-6.5l24-42.2A4.5 4.5 0 0 1 34 6z" fill="{g:gold}"/></g>
<path d="M34 22v16" stroke="#4A2A00" stroke-width="5" stroke-linecap="round"/>
<circle cx="34" cy="47.5" r="3.2" fill="#4A2A00"/>''')
