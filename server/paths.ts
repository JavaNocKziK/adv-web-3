export class Paths {
    public static get __root():string {
        let pathBits:string[] = __dirname.split('\\');
        let newPathBits:string[] = [];
        for(let i = 0; i < pathBits.length - 2; i++) {
            newPathBits.push(pathBits[i]);
        }
        return newPathBits.join('\\');
    }
}