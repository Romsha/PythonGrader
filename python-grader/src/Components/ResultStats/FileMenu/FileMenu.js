import { useEffect } from 'react';
import './FileMenu.css';
import GaugeIcon from '../../../assets/GaugeIcon.png'

export default function FileMenu(props) {
    
    useEffect(() => {
        const cur = document.body.style.overflowY;
        document.body.style.overflowY = 'hidden';
        return () => {document.body.style.overflowY = cur};
    }, []);

    const getGradeClass = (grade) => {
        var cls = 'fileMenuGrade ';
        if (grade > 66) {
            cls += 'menuGoodGrade';
        } else if (grade > 33) {
            cls += 'menuMedGrade';
        } else {
            cls += 'menuBadGrade'; 
        }
        return cls;
    }
    

    return (
        <div className="fileMenu" onClick={props.closeMenu}>
            <div className="fileMenuBG" onClick={(event) => event.stopPropagation()}>
                <h2 className="fileMenuTitle">Select file for data display</h2>
                <div className="fileMenuList">
                    <div className="fileMenuItem fileMenuItemZip" onClick={() => props.selectFile(props.fileNames[0])}>
                        <span className="fileMenuIndex">1.</span>
                        <span className="fileMenuZip">ZIP</span>
                        <span>{props.fileNames[0]}</span>
                        <div />
                        <img src={GaugeIcon} />
                        <span className={getGradeClass(props.fileGrades[0])}>{props.fileGrades[0]}</span>
                    </div>
                    {props.fileNames.slice(1).map((name, index) => 
                        <div 
                            key={name} 
                            className="fileMenuItem"
                            onClick={() => props.selectFile(name)}>
                                <span className="fileMenuIndex">{index+2}.</span>
                                <span>{name}</span>
                                <div />
                                <img src={GaugeIcon} />
                                <span className={getGradeClass(props.fileGrades[index+1])}>{props.fileGrades[index+1]}</span>
                    </div>)}
                </div>
            </div>
        </div>
    )
}