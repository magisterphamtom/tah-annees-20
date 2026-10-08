# État — Token Action HUD, thème Années 20

## Fait (v1.0.0)
- Style ajouté via le hook `tokenActionHudCoreRegisterStyles` (clé `annees20`, classe `tah-style-annees20`).
- CSS = structure TAH Core (less/vendor/tah-hud.less, CC BY 4.0) + variables et habillage Art Déco, compilé avec lessc 4.
- Classe `tah-annees20-active` sur <body> (hook clientSettingChanged) pour styler les infobulles.
- Polices embarquées : Limelight, Poiret One, Special Elite.

## À tester (14.368 + TAH Core 2.1.2 + TAH CoC7 1.3.0)
- Le style apparaît dans la liste et s'applique sans recharger.
- Panneaux déroulants (vers le bas / vers le haut), mode édition (déverrouillé), HUD réduit.
- Infobulles.

## Points incertains
- Si TAH Core change sa feuille de structure, recopier less/vendor/tah-hud.less depuis la nouvelle version et recompiler.
