import ast
from typing import Tuple, Union
from queue import Queue


class TextParser:
    ALLOWED_LINE_LEN = 80

    def __init__(self, source: bytes) -> None:
        self.sourceLines = source.split(b'\n')

    def _linesData(self) -> Tuple[int, int]:
        numLines = len(self.sourceLines)
        numNotEmpty = len(list(filter(lambda l: l.strip() != '', self.sourceLines)))
        return numLines, numNotEmpty
        
    def _longLinesCount(self) -> int:
        isLong = lambda l: len(l.rstrip()) > self.ALLOWED_LINE_LEN
        return len(list(filter(isLong, self.sourceLines)))

    def getData(self) -> dict:
        data = {}
        data['numLines'], data['numNotEmptyLines'] = self._linesData()
        data['numLongLines'] = self._longLinesCount()
        return data


class ASTParser:
    ALLOWED_OBJ_SIZE = 30

    def __init__(self, source: str) -> None:
        try:
            self.tree = ast.parse(source)
        except:
            raise ValueError('Could not parse python file')

    @staticmethod
    def _isClass(obj):
        return isinstance(obj, ast.ClassDef)

    @staticmethod
    def _isFunc(obj):
        return isinstance(obj, ast.FunctionDef)

    @staticmethod
    def _isObj(obj):
        return (ASTParser._isClass(obj) or ASTParser._isFunc(obj))

    @staticmethod
    def _isFuncLong(funcObj: ast.FunctionDef, max_len=None) -> int:
        # TODO: ignore doc lines
        if not max_len:
            max_len = ASTParser.ALLOWED_OBJ_SIZE
        return (funcObj.end_lineno - funcObj.lineno) > max_len

    @staticmethod
    def _isClassBig(clsObj: ast.ClassDef) -> int:
        return len(list(filter(ASTParser._isObj, clsObj.body))) > ASTParser.ALLOWED_OBJ_SIZE

    def _objectsWalk(self, classFilter, funcFilter) -> Tuple[int, int]:
        classCount = 0
        funcCount = 0
        objectQueue = Queue()
        for obj in filter(ASTParser._isObj, self.tree.body):
            objectQueue.put(obj)

        while not objectQueue.empty():
            obj = objectQueue.get()
            if ASTParser._isClass(obj) and classFilter(obj):
                classCount += 1
            elif ASTParser._isFunc(obj) and funcFilter(obj):
                funcCount += 1
            for child in filter(ASTParser._isObj, obj.body):
                objectQueue.put(child)
        
        return classCount, funcCount

    def _objectCount(self) -> Tuple[int, int]:
        counter = lambda _: True
        return self._objectsWalk(
            counter,
            counter
        )

    def _bigObjectsCount(self) -> Tuple[int, int]:
        return self._objectsWalk(
            ASTParser._isClassBig,
            ASTParser._isFuncLong
        )
    
    def _isDocBig(self) -> int:
        return len(list(filter(ASTParser._isObj, self.tree.body))) > ASTParser.ALLOWED_OBJ_SIZE

    @staticmethod
    def _hasDocstring(obj: Union[ast.FunctionDef, ast.ClassDef]) -> bool:
        firstChild = obj.body[0]
        return isinstance(firstChild, ast.Expr) and isinstance(firstChild.value, ast.Constant)
    
    def _docObjectsCount(self) -> Tuple[int, int]:
        SMALL_FUNC_LEN = 5
        return self._objectsWalk(
            ASTParser._hasDocstring,
            lambda f: (ASTParser._hasDocstring(f) or not ASTParser._isFuncLong(f, SMALL_FUNC_LEN))
        )

    def getData(self) -> dict:
        data = {}
        data['numClasses'], data['numFuncs'] = self._objectCount()
        data['numBigClasses'], data['numLongFuncs'] = self._bigObjectsCount()
        data['numDocClasses'], data['numDocFuncs'] = self._docObjectsCount()
        data['isDocBig'] = self._isDocBig()
        return data


def parseData(source: str) -> dict:
    data = TextParser(source).getData()
    try:
        data.update(ASTParser(source).getData())
        return data
    except:
        return {}
        

def main():
    source = open('test.txt').read()
    print(ASTParser(source).getData())


if __name__ == '__main__':
    main()