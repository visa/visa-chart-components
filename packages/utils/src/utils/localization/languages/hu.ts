/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const hu = {
  vcc: {
    attr: {
      language: 'hu'
    },
    general: {
      generic: {
        altTextGenerator: {
          overallNumberOfGroups: 'Elemek teljes száma:',
          overallNumberOfGeom: 'Elemek teljes száma ezen a diagramon:',
          numberOfInteractiveElements: 'Interkatív elemek száma:'
        },
        keyboardInstructions: {
          enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy elem csoporton.',
          shiftEnter: 'Egy szinttel feljebb egy elem csoporton vagy elemen.',
          space: 'Elem kiválasztás/kiválasztás megszüntetése egy elemen.',
          horizontalArrows:
            'Navigálás elemcsoportok között vagy elemeken kívül amikor a fókusz egy elemcsoporton vagy elemen van.',
          verticalArrows:
            'Navigálás elemek között elemcsoportokon belül amikor a fókusz egy elemcsoporton vagy elemen van.'
        }
      },
      geomTypes: {
        bar: 'oszlop',
        slice: 'cikk',
        point: 'pont',
        marker: 'pontjelző',
        node: 'elem',
        dumbbell: 'súlyvonal',
        link: 'link',
        cell: 'cella'
      },
      groupNames: {
        'scatter-group': 'szóráscsoport',
        stack: 'halmozott oszlop',
        cluster: 'csoportosított oszlop',
        'marker-group': 'pontjelzőcsoport',
        pie: 'torta',
        line: 'vonal',
        node: 'elem',
        row: 'sor',
        'node-collection': 'elem kollekció'
      },
      keys: {
        ctrl: 'Kontrol',
        enter: 'Enter',
        shift: 'Shift',
        space: 'Szóköz',
        esc: 'Esc',
        tab: 'Tab'
      },
      keywords: {
        structure: 'Struktúra',
        selected: 'kiválasztott',
        action: 'akció',
        result: 'eredmény',
        note: 'jegyzet',
        keyboard: 'billentyűzet',
        interactive: 'interaktív',
        titled: 'elnevezés',
        title: 'diagram címe',
        subtitle: 'alcím',
        static: 'statikus',
        image: 'kép',
        purpose: 'cél',
        chart: 'diagram',
        start: 'kezdeti erték',
        end: 'végső érték',
        value: 'érték',
        axis: 'tengely',
        annotation: 'diagram magyarázat'
      },
      expressions: {
        keyboardInstructions: 'Billentyűzet Instrukciók',
        showKeyboardInstructions: 'Billentyűzet Instrukciók Megjelenítése',
        keyboardInstructionsNote:
          'Mac számítügépen (Voiceover szofter használatakor) a legjobb navigációs élmény érdekében ezen két gomb nyomvatartása ajánlott.',
        dismissTooltip: 'Az elemleírás eltüntetése, bármelyik elemen való fókuszáláskor.',
        keyboardInstructionsEsc: 'Kilépés a diagramból, bármelyik elemen való fókuszáláskor.',
        butSomeMayBeHiddenUntilYouInteractWithThisNode:
          '(de pár elem rejtve maradhat addig ameddig interakció nem történik ezzel az elemmel).',
        asAPercentage: 'mint százalék',
        numberOfAnnotations: 'Diagram magyarázatok száma:'
      }
    },
    dataTable: {
      table1:
        'Jelen pillanatban az első adattáblára való fókuszálás történik. Összesen két adattábla van. Ez az adattábla adatokat tartalmaz a diagram elemeiről.',
      table2:
        'Jelen pillanatban a második adattáblára való fókuszálás történik. Összesen két adattábla van. Ez az adattábla adatokat tartalmaz a diagram linkjeiről.',
      display: 'Adattábla megjelenítése'
    },
    accessibilityController: {
      navigateToTheChartAreaByPressingEnter: 'Navigálás a diagramterületre az ENTER billentyű lenyomásával.'
    },
    accessibilityDescriptions: {
      chartLayoutDescription: 'Diagramterület leírása',
      withNoTitleProvided: 'cím nélkül.',
      fullDescription:
        'Ez a szekció információkkal szolgál a diagramról. A TAB billentyű lenyomásával a fókusz a billentyűzet instruckciók menüpontra kerül. A TAB újbóli lenyomása a diagram területre való navigálást eredményez.',
      nonInteractive:
        'Ez a szekció információkkal szolgál a diagramról. A TAB billentyű lenyomásával a fókusz az adattábla gombra kerül.',
      longDescription: 'Hosszú leírás',
      executiveSummary: 'Összefoglalás',
      statisticalInformation: 'Statisztikai Információk',
      xAxis: 'A diagram horizontális X tengelyt tartalmaz.',
      yAxis: 'A diagram vertikális Y tengelyt tartalmaz.',
      primaryYAxis: 'A diagram elsődleges vertikális Y tengelyt tartalmaz.',
      secondaryYAxis: 'A diagram másodlagos vertikális Y tengelyt tartalmaz.',
      multipleYAxisSections: 'A diagram több vertikális Y tengely szekciót tartalmaz.',
      numberOfVerticalYAxisSections: 'Vertikális Y tengely szekciók száma:',
      usingDifferentScales: 'Az Y tengelyek különböző beosztásúak.',
      thisSeriesIsTitled: 'Ezen sorozat címe:',
      notesAboutTheChartStructure: 'Jegyzetek a diagram struktúrájáról:',
      numberOfAnnotationsOnTheChart: 'Diagram magyarázatok száma a diagram területen:'
    },
    'bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Oszlopok teljes száma:',
        overallNumberOfGeom: 'Oszlopok teljes száma ezen a diagramon:',
        numberOfInteractiveElements: 'Az interaktív oszlopok száma:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy oszlopcsoporton.',
        shiftEnter: 'Egy szinttel feljebb egy oszlopcsoporton vagy oszlopon.',
        space: 'Oszlop kiválasztás/kiválasztás megszüntetése egy oszlopon.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő oszlopcsoportok vagy oszlopokon kívül amikor a fókusz egy oszlopcsoporton vagy oszlopon van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő oszlopcsoportok vagy oszlopokon belül amikor a fókusz egy oszlopcsoporton vagy oszlopon van.'
      }
    },
    'clustered-bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Csoportosított oszlopok teljes száma:',
        overallNumberOfGeom: 'A kiválasztott csoportban lévő oszlopok teljes száma:',
        numberOfInteractiveElements: 'Az interaktív oszlopok száma ebben a csoportosított oszlopban:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy csoportosított oszlopokban.',
        shiftEnter: 'Egy szinttel feljebb egy csoportosított oszlop területen vagy oszlopon.',
        space: 'Oszlop kiválasztás/kiválasztás megszüntetése egy oszlopon.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő csoportosított oszlopok vagy oszlopokon kívül amikor a fókusz egy csoportosított oszlopcsoporton vagy oszlopon van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő csoportosított oszlopok vagy oszlopokon belül amikor a fókusz egy csoportosított oszlopcsoporton vagy oszlopon van.'
      }
    },
    'stacked-bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Halmozott oszlopok teljes száma:',
        overallNumberOfGeom: 'A kiválasztott halomban lévő oszlopok teljes száma:',
        numberOfInteractiveElements: 'Az interaktív oszlopok száma ebben a halomozott oszlopban:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy halmozott oszlopokban.',
        shiftEnter: 'Egy szinttel feljebb egy halmozott oszlop területen vagy oszlopon.',
        space: 'Oszlop kiválasztás/kiválasztás megszüntetése egy oszlopon.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő halmozott oszlopok vagy oszlopokon kívül amikor a fókusz egy csoportosított halmozott oszlopon vagy oszlopon van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő halmozott oszlopok vagy oszlopokon belül amikor a fókusz egy csoportosított halmozott oszlopon vagy oszlopon van.'
      }
    },
    'line-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Vonalak teljes száma:',
        overallNumberOfGeom: 'A kiválasztott vonalon lévő pontok teljes száma:',
        numberOfInteractiveElements: 'Az interaktív pontok száma a kiválasztott vonalon:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy vonalon.',
        shiftEnter: 'Egy szinttel feljebb egy vonalon vagy ponton.',
        space: 'Pont kiválasztás/kiválasztás megszüntetése egy ponton vagy vonalon.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő vonalak vagy pontokon kívül amikor a fókusz egy vonalon vagy ponton van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő vonalak vagy pontokon kívül amikor a fókusz egy vonalon vagy ponton van.'
      }
    },
    'pie-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Cikkek teljes száma:',
        overallNumberOfGeom: 'Cikkek teljes száma ebben a torta diagramban:',
        numberOfInteractiveElements: 'Az interaktív cikkek száma ebben a torta diagramon:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy cikken.',
        shiftEnter: 'Egy szinttel feljebb egy cikken.',
        space: 'Cikk kiválasztás/kiválasztás megszüntetése egy cikken.',
        horizontalArrows: 'Navigálás azonos csoportban lévő cikken kívül amikor a fókusz egy cikken van.'
      }
    },
    'scatter-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'Szóráscsoportok teljes száma:',
        overallNumberOfGeom: 'Szórások teljes száma ebben a szóráscsoportban:',
        numberOfInteractiveElements: 'Az interaktív szóráspontok száma ebben a szóráscsoportban:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy szóráscsoportban.',
        shiftEnter: 'Egy szinttel feljebb egy szóráscsoporton vagy ponton.',
        space: 'Pont kiválasztás/kiválasztás megszüntetése egy szóráscsoporton.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő szóráscsoportok vagy pontokon kívül amikor a fókusz egy szóráscsoporton vagy ponton van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő szóráscsoportok vagy pontokon belül amikor a fókusz egy szóráscsoporton vagy ponton van.'
      }
    },
    'heat-map': {
      altTextGenerator: {
        overallNumberOfGroups: 'Sorok teljes száma:',
        overallNumberOfGeom: 'Cellák teljes száma ebben a sorban:',
        numberOfInteractiveElements: 'Az interaktív cellák száma ebben a sorban:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy sorban.',
        shiftEnter: 'Egy szinttel feljebb egy soron vagy cellán.',
        space: 'Cella kiválasztás/kiválasztás megszüntetése egy cellán.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő sorok vagy cellákon kívül amikor a fókusz egy soron vagy cellán van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő sorok vagy cellákon belül amikor a fókusz egy soron vagy cellán van.'
      }
    },
    'circle-packing': {
      altTextGenerator: {
        overallNumberOfGroups: 'Gyűjtőkörök teljes száma:',
        numberOfChildElements: 'Gyermek gyűjtőkörök teljes száma:',
        overallNumberOfGeom: 'Gyűjtőkörök teljes száma ebben a gyűjtőkör kollekcióban:',
        numberOfInteractiveElements: 'Az interaktív gyűjtőkörök száma ebben a gyűjtőkörben:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy gyűjtőpont kollekción.',
        shiftEnter: 'Egy szinttel feljebb egy gyüjtőpont kollekción vagy gyüjtőponton.',
        space: 'Gyüjtőpont kiválasztás/kiválasztás megszüntetése egy gyüjtőpont kollekción vagy gyűjtőponton.',
        horizontalArrows:
          'Navigálás azonos gyűjtőpont kollekciókon vagy gyűjtőpontokon kívül amikor a fókusz egy gyűjtőpont kollekciókon vagy gyűjtőponton van.',
        verticalArrows:
          'Navigálás azonos gyűjtőpont kollekciókon vagy gyűjtőpontokon belül amikor a fókusz egy gyűjtőpont kollekciókon vagy gyűjtőponton van.'
      }
    },
    'parallel-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'Vonalak teljes száma:',
        overallNumberOfGeom: 'A kiválasztott vonalon lévő pontok teljes száma ebben a párhuzamos vonaldiagramon:',
        numberOfInteractiveElements: 'Az interaktív pontok száma a kiválasztott vonalon:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy vonalon.',
        shiftEnter: 'Egy szinttel feljebb egy vonalon vagy ponton.',
        space: 'Pont kiválasztás/kiválasztás megszüntetése egy ponton.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő vonalak vagy pontokon kívül amikor a fókusz egy vonalon vagy ponton van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő vonalak vagy pontokon kívül amikor a fókusz egy vonalon vagy ponton van.'
      }
    },
    'dumbbell-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'súlyvonalak teljes száma:',
        overallNumberOfGeom: 'súlyvonalak teljes száma ezen a súlyvonal diagramon:',
        numberOfInteractiveElements: 'Az interaktív súlyvonalak száma a kiválasztott súlyvonal diagramon.'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy csoporton.',
        shiftEnter: 'Egy szinttel feljebb egy csopporton vagy súlyvonalon.',
        space: 'súlyvonal kiválasztás/kiválasztás megszüntetése egy súlyvonalon.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő csoportok vagy súlyvonalakon kívül amikor a fókusz egy csoporton vagy súlyvonalon van.'
      }
    },
    'world-map': {
      altTextGenerator: {
        overallNumberOfGroups: 'Pontjelzők teljes száma:',
        overallNumberOfGeom: 'Pontjelzők teljes száma ezen a térképen:',
        numberOfInteractiveElements: 'Az interaktív pontjelzők teljes száma ezen a térképen:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy pontjelző csoporton.',
        shiftEnter: 'Egy szinttel feljebb egy pontjelző csoporton vagy pontjelőn.',
        space: 'Pontjelző kiválasztás/kiválasztás megszüntetése egy pontjelőn.',
        horizontalArrows:
          'Navigálás azonos csoportban lévő pontjelzőcsoportokon vagy pontjelzőkön kívül amikor a fókusz egy pontjelzőcsoporton vagy pontjelzőn van.',
        verticalArrows:
          'Navigálás azonos csoportban lévő pontjelzőcsoportokon vagy pontjelzőkön belül amikor a fókusz egy pontjelzőcsoporton vagy pontjelzőn van.'
      }
    },
    'alluvial-diagram': {
      altTextGenerator: {
        overallNumberOfGroups: 'Elemek vagy kapcsolatok teljes száma:',
        overallNumberOfGeom:
          'Elemek vagy kapcsolatok teljes száma a jelenleg kiválasztott elemeken vagy kapcsolatokon:',
        numberOfInteractiveElements:
          'Az interaktív elemek vagy kapcsolatok száma ezeken az elemeken vagy kapcsolatokon:'
      },
      keyboardInstructions: {
        enter: 'Belépés a diagram területre/egy szinttel lejebb a diagram területen vagy elemeken.',
        shiftEnter: 'Egy szinttel feljebb egy elemen vagy kapcsolaton.',
        space: 'Kpacsolat kiválasztás/kiválasztás megszüntetése egy kapcsolaton.',
        horizontalArrows: 'Navigálás azonos kapcsolatokon vagy elemeken kívül.',
        verticalArrows: 'Egy szinttel feljebb, a kapcsolat forrásához vagy cél elemhez egy linken.'
      }
    }
  }
};
