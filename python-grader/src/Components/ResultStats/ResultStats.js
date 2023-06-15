import './ResultStats.css';
import { useState, useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import StatDisplay, {TYPES as STATS_TYPES} from './StatDisplay/StatDisplay'
import FileMenu from './FileMenu/FileMenu';
import { arraySum, limitFileName } from '../../utils';

export default function ResultStats(props) {
    const [allData, setAllData] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [showingMenu, setShowingMenu] = useState(false);

    const RES_TYPES = {ZIP: 'ZIP', PY: 'PY', GIT: 'GIT'};
    const SUM_KEYS = ['numClasses', 'numNotEmptyLines', 'numFuncs', 'filesNum'];

    const getSafePerc = (value, total) => {
        if (total === 0) {
            return 100;
        }
        return Math.round(value * 100.0 / total);
    }

    const calcFileData = (fileData) => {
        const fileGrades =  {
            longLines: 100-getSafePerc(fileData.numLongLines, fileData.numNotEmptyLines),
            docClasses: getSafePerc(fileData.numDocClasses, fileData.numClasses),
            docFuncs: getSafePerc(fileData.numDocFuncs, fileData.numFuncs),
            longClasses: 100-getSafePerc(fileData.numBigClasses, fileData.numClasses),
            longFuncs: 100-getSafePerc(fileData.numLongFuncs,fileData.numFuncs),
            docSize: fileData.isDocBig ? 0 : 100
        };
        const totalGrade = Math.round(arraySum(Object.values(fileGrades)) / Object.values(fileGrades).length);
        fileGrades.totalGrade = totalGrade;
        for (let key of SUM_KEYS) {
            fileGrades[key] = fileData[key];
        }
        fileGrades.filesNum = 1;
        return fileGrades;
    }

    const totalGrades = (gradesArr) => {
        const total = {};
        for (let key of Object.keys(gradesArr[0])) {
            
            const sum = arraySum(gradesArr.map(g => g[key]));
            if (SUM_KEYS.includes(key)) {
                total[key] = sum;
            } else {
                total[key] = Math.round(sum / gradesArr.length);
            }
        }
        return total;
    }

    const calcData = () => {
        const data = {
            total: {name: '', grades: {}},
            files: {}
        }

        // TODO: handle error
        if (!props.data.success) { return }
        data.total.name = props.data.name;

        if (props.data.type === RES_TYPES.PY) {
            data.total.grades = calcFileData(props.data.data);
        } else {
            const allFilesData = props.data.data;
            const allFilesGrades = [];
            for (let fileRes of allFilesData) {
                if (!fileRes.success) { continue }
                // TODO: handle error
                const fileGrades = calcFileData(fileRes.data)
                allFilesGrades.push(fileGrades);
                data.files[fileRes.name] = fileGrades;
            }
            data.total.grades = totalGrades(allFilesGrades);
        }

        setAllData(data);
        setCurrentFile(data.total);
    }

    useEffect(() => {
        animateScroll.scrollToBottom({
          duration: 1500, 
          delay: 100, 
          smooth: true,
        });
        calcData();
    }, []);

    const selectFile = (fileName) => {
        if (fileName === currentFile.name) { return }
        if (fileName === allData.total.name) {
            setCurrentFile(allData.total);
        } else {
            setCurrentFile({ name: fileName, grades: allData.files[fileName] });
        }
        setShowingMenu(false);
    }

    if (!currentFile) {return <div/>}    
    return (
        <>
        <div className="statsContainer">
            <h1 className="statsTitle title">
                Stats for file: {limitFileName(currentFile.name, 20)}
                {Object.keys(allData.files).length > 0 ? 
                    <div className="hamburger" onClick={() => setShowingMenu(true)}><div/><div/><div/></div> : ''}
            </h1>
            <div className="resultsContainer">
                <h2 className="resultsRowTitle">Basic<br/>Stats:</h2>
                <StatDisplay type={STATS_TYPES.NUMBER} data={currentFile.grades.filesNum} label="files" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={currentFile.grades.numNotEmptyLines} label="lines" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={currentFile.grades.numClasses} label="classes" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={currentFile.grades.numFuncs} label="functions" />

                <h2 className="resultsRowTitle">Style<br/>Stats:</h2>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.longLines} 
                    label="good length lines" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.docClasses} 
                    label="documented classes" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.docFuncs} 
                    label="documented functions" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.longClasses} 
                    label="good length classes" />
                
                <div/>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.longFuncs} 
                    label="good length functions" />
                <StatDisplay 
                    type={STATS_TYPES.BOOL} 
                    value={currentFile.grades.docSize === 100}
                    data={currentFile.grades.docSize === 100 ? 'Great' : 'Too Big'} 
                    label="module size" />
                <div/>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={currentFile.grades.totalGrade} 
                    total={true}
                    label="total grade" />
            </div>
        </div>
        {showingMenu ? <FileMenu 
                            fileNames={[allData.total.name].concat(Object.keys(allData.files))}
                            fileGrades={[allData.total.grades.totalGrade].concat(Object.values(allData.files).map(grades => grades.totalGrade))} 
                            selectFile={selectFile}
                            resType={props.data.type === 'GIT' ? 'REPO' : props.data.type}
                            closeMenu={() => setShowingMenu(false)}/> : ''}
        </>
    )
}