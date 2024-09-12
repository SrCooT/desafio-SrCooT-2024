class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "macaco", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "gazela", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "leao", quantidade: 1 }] }
        ];

        this.animais = {
            leao: { tamanho: 3, biomas: ["savana"], carnivoro: true },
            leopardo: { tamanho: 2, biomas: ["savana"], carnivoro: true },
            crocodilo: { tamanho: 3, biomas: ["rio"], carnivoro: true },
            macaco: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            gazela: { tamanho: 2, biomas: ["savana"], carnivoro: false },
            hipopotamo: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal.toLowerCase()]) {
            console.log(`Animal ${animal} não encontrado.`);
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            console.log(`Quantidade ${quantidade} é inválida.`);
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas } = this.animais[animal.toLowerCase()];
        const tamanhoTotalNovoGrupo = quantidade * tamanho;
        const recintosViaveis = [];

        console.log(`Iniciando análise para ${quantidade} ${animal}(s).`);

        this.recintos.forEach((recinto) => {
            // verifica se é array 
            const recintoBiomas = recinto.bioma.includes(' e ') ? recinto.bioma.split(' e ') : [recinto.bioma];

            console.log(`Verificando Recinto ${recinto.numero} com bioma(s): ${recintoBiomas.join(', ')}.`);

            // Verifica se algum bioma do recinto é compatível com os biomas do animal
            if (biomas.some(b => recintoBiomas.includes(b))) {
                let espacoOcupado = 0;
                let temCarnivoro = false;
                let maisDeUmaEspecie = false;
                let possuiMacacoSozinho = false;

                recinto.animais.forEach((a) => {
                    const animalInfo = this.animais[a.especie.toLowerCase()];
                    espacoOcupado += a.quantidade * animalInfo.tamanho;
                    if (animalInfo.carnivoro && a.especie.toLowerCase() !== animal.toLowerCase()) temCarnivoro = true;
                    if (a.especie.toLowerCase() !== animal.toLowerCase()) maisDeUmaEspecie = true;
                    if (a.especie.toLowerCase() === "macaco" && a.quantidade === 1) possuiMacacoSozinho = true;
                });

                let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

                console.log(`Recinto ${recinto.numero}: espaçoOcupado=${espacoOcupado}, espacoDisponivel=${espacoDisponivel}.`);

                // Reduz o espaço disponível se houver mais de uma espécie
                if (maisDeUmaEspecie && !recinto.animais.every(a => a.especie.toLowerCase() === animal.toLowerCase())) {
                    espacoDisponivel -= 1; // Redução adicional de espaço
                    console.log(`Recinto ${recinto.numero}: mais de uma espécie detectada, redução de espaço.`);
                }

                // Verifica se o recinto é viável
                if (!temCarnivoro && espacoDisponivel >= tamanhoTotalNovoGrupo) {
                    if (animal.toLowerCase() === "hipopotamo" && maisDeUmaEspecie && !recintoBiomas.includes("savana") && !recintoBiomas.includes("rio")) {
                        console.log(`Recinto ${recinto.numero} rejeitado: Hipopótamo e mais de uma espécie fora da savana e rio.`);
                        return;
                    }
                    if (animal.toLowerCase() === "macaco" && quantidade === 1 && espacoOcupado === 0) {
                        console.log(`Recinto ${recinto.numero} rejeitado: Macaco sozinho em recinto vazio.`);
                        return;
                    }
                    if (possuiMacacoSozinho && animal.toLowerCase() !== "macaco") {
                        console.log(`Recinto ${recinto.numero} rejeitado: Contém macaco sozinho e outro animal não é macaco.`);
                        return;
                    }

                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - tamanhoTotalNovoGrupo} total: ${recinto.tamanhoTotal})`);
                    console.log(`Recinto ${recinto.numero} adicionado como viável.`);
                } else {
                    console.log(`Recinto ${recinto.numero} não é viável: temCarnivoro=${temCarnivoro}, espacoDisponivel=${espacoDisponivel}, tamanhoTotalNovoGrupo=${tamanhoTotalNovoGrupo}`);
                }
            } else {
                console.log(`Recinto ${recinto.numero} rejeitado: Bioma incompatível.`);
            }
        });

        if (recintosViaveis.length === 0) {
            console.log(`Nenhum recinto viável encontrado para ${quantidade} ${animal}(s).`);
            return { erro: "Não há recinto viável" };
        }

        console.log(`Recintos viáveis encontrados: ${recintosViaveis.join(', ')}.`);
        return { recintosViaveis: recintosViaveis.sort() };
    }
}

export { RecintosZoo as RecintosZoo };
