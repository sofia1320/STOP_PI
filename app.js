import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://xtsrzfljmsljlpqevnca.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0c3J6ZmxqbXNsamxwcWV2bmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTAzNzMsImV4cCI6MjA2NDYyNjM3M30.oefIQNt4J1S8GzhYRnF8ZpbFOb5pRIzMFyCkB_To5fc');


// REGISTO UTENTE
const criarUForm = document.getElementById("criarUForm");
if (criarUForm) { 
    criarUForm.addEventListener("submit", async function (e) { 
        e.preventDefault(); 

        const email = document.getElementById("emailU").value.trim();
        const password = document.getElementById("passwordU").value.trim();

        if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert("Ocorreu um erro ao criar a conta. Por favor, tente novamente.");
            return;
        }

        alert("Conta criada com sucesso! Faça login para continuar.");
        window.location.href = "login.html";
    });
}

// REGISTO PROFISSIONAL
const criarPForm = document.getElementById("criarPForm");
if (criarPForm) {
    criarPForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("emailP").value.trim();
        const password = document.getElementById("passwordP").value.trim();

        if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert("Ocorreu um erro ao criar a conta. Por favor, tente novamente.");
            return;
        }

        alert("Conta criada com sucesso! Faça login para continuar.");
        window.location.href = "login.html";
    });
}

// LOGIN (comum a ambos)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("Credenciais inválidas.");
            return;
        }

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            return;
        }
        const user = userData.user;

        let { data: utente } = await supabase
            .from('perfis_utentes')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (utente) {
            window.location.href = "ProgressoU.html";
            return;
        }

        let { data: profissional } = await supabase
            .from('perfis_profissionais')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (profissional) {
            window.location.href = "InicialP.html";
            return;
        }

        const tipoPerfil = document.querySelector('input[name="tipoPerfil"]:checked').value;
        if (tipoPerfil === "profissional") {
            window.location.href = "continuarP.html";
        } else {
            window.location.href = "continuarU.html";
        }
    });
}

// PERFIL UTENTE
const perfilUForm = document.getElementById("perfilUForm");
if (perfilUForm) {
    perfilUForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("usernameU").value;
        const dataNascimento = document.getElementById("dataNascimentoU").value;
        const inicioSobriedade = document.getElementById("inicioSobriedade").value;
        const tipoVicio = document.getElementById("tipoVicio").value;

        if (!username || !dataNascimento || !inicioSobriedade || !tipoVicio) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "login.html";
            return;
        }
        const user = userData.user;

        const { error } = await supabase
            .from('perfis_utentes')
            .insert([{
                user_id: user.id,
                username: username,
                data_nascimento: dataNascimento,
                inicio_sobriedade: inicioSobriedade,
                tipo_vicio: tipoVicio
            }]);

        if (error) {
            alert("Erro ao guardar perfil: " + error.message);
        } else {
            alert("Perfil guardado com sucesso!");
            window.location.href = "ProgressoU.html";
        }
    });
}

// PERFIL PROFISSIONAL
const perfilPForm = document.getElementById("perfilPForm");
if (perfilPForm) {
    perfilPForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("usernameP").value;
        const dataNascimento = document.getElementById("dataNascimentoP").value;
        const especialidadePsicologia = document.getElementById("especialidadePsicologia").value;

        if (!username || !dataNascimento || !especialidadePsicologia) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "login.html";
            return;
        }
        const user = userData.user;

        const { error } = await supabase
            .from('perfis_profissionais')
            .insert([{
                user_id: user.id,
                username: username,
                data_nascimento: dataNascimento,
                especialidade_psicologia: especialidadePsicologia
            }]);

        if (error) {
            alert("Erro ao guardar perfil: " + error.message);
        } else {
            alert("Perfil guardado com sucesso!");
            window.location.href = "InicialP.html";
        }
    });
}


// PROGRESSO UTENTE
if (document.getElementById("counter-days")) {
    let contadorInterval = null; 

    async function getInicioSobriedade() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) return null;
        const user = userData.user;

        const { data: perfil } = await supabase
            .from('perfis_utentes')
            .select('inicio_sobriedade')
            .eq('user_id', user.id)
            .maybeSingle();

        return perfil ? perfil.inicio_sobriedade : null; // condição ? valor_se_verdadeiro : valor_se_falso
    }

    // Função para converter string de data em objeto Date
    function parseDate(dateStr) {
        if (!dateStr) return null;
        return new Date(dateStr);
    }

    function atualizarContador(dataInicio) {
        if (contadorInterval) {
            clearInterval(contadorInterval);
        }


        function update() {
            const inicio = parseDate(dataInicio);
            if (!inicio || isNaN(inicio.getTime())) {
                // Se não for válida, mostra traços
                document.getElementById("counter-days").textContent = "-";
                document.getElementById("counter-time").textContent = "--:--:--";
                return;
            }
            const agora = new Date();
            let diff = agora - inicio; // Calcula a diferença entre agora e a data de início

            if (diff < 0) diff = 0; // Se a diferença for negativa, assume zero

            const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((diff / (1000 * 60)) % 60);
            const segundos = Math.floor((diff / 1000) % 60);

            document.getElementById("counter-days").textContent = dias;
            document.getElementById("counter-time").textContent =
                `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }

        update();
        contadorInterval = setInterval(update, 1000); 
    }

    getInicioSobriedade().then(dataInicio => {
        if (dataInicio) {
            atualizarContador(dataInicio);
        } else {
            document.getElementById("counter-days").textContent = "-";
            document.getElementById("counter-time").textContent = "--:--:--";
        }
    });

    async function resetarSobriedade() {
        const { data: userData } = await supabase.auth.getUser(); 
        if (!userData || !userData.user) return; // Se não houver utilizador autenticado, sai da função
        const user = userData.user;
        const agoraISO = new Date().toISOString(); // Cria uma string com a data e hora atuais no formato ISO (ex: "2025-06-17T14:23:00.000Z")

        await supabase
            .from('perfis_utentes')
            .update({ inicio_sobriedade: agoraISO })
            .eq('user_id', user.id);
        atualizarContador(agoraISO);
    }

    const btnRecomecar = document.querySelector('.logo-box button');
    if (btnRecomecar) {
        btnRecomecar.addEventListener('click', async function (e) {
            e.preventDefault();
            if (confirm("Tens a certeza que queres recomeçar o teu contador?")) {
                await resetarSobriedade();
            }
        });
    }
}


// DIÁRIO UTENTE
const btnAdicionar = document.getElementById("adicionarEntradaBtn");
const formEntrada = document.getElementById("formEntradaDiario");
const cancelarEntrada = document.getElementById("cancelarEntrada");
const diarioBox = document.querySelector(".diario-box .row");

if (btnAdicionar && formEntrada && cancelarEntrada && diarioBox) { 
    btnAdicionar.addEventListener("click", () => {
        formEntrada.style.display = "block";
        btnAdicionar.style.display = "none";
    });

    cancelarEntrada.addEventListener("click", () => {
        formEntrada.style.display = "none";
        btnAdicionar.style.display = "block";
        formEntrada.reset();
    });

    formEntrada.addEventListener("submit", async function (e) {
        e.preventDefault();
        const texto = document.getElementById("textoEntrada").value;
        const imagemInput = document.getElementById("imagemEntrada");
        let imagemURL = "";

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            return;
        }
        const user = userData.user;

        if (imagemInput.files && imagemInput.files[0]) {
            const file = imagemInput.files[0]; // guarda o primeiro ficheiro selecionado na variável file
            const fileExt = file.name.split('.').pop(); // file - nome ficheiro, split - divide o nome em partes, pop - retira e devolve o ultimo elemeto do array (extensão do ficheiro - ex: png)
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const { data, error } = await supabase
                .storage
                .from('diarioimagens')
                .upload(fileName, file);

            if (error) {
                alert("Erro ao fazer upload da imagem: " + error.message);
                return;
            }
            const { data: publicUrlData } = supabase
                .storage
                .from('diarioimagens')
                .getPublicUrl(fileName);
            imagemURL = publicUrlData.publicUrl;
        }

        const { error: insertError } = await supabase
            .from('diario_utente')
            .insert([{
                user_id: user.id,
                texto: texto,
                imagem_url: imagemURL
            }]);

        if (insertError) {
            alert("Erro ao guardar entrada no diário.");
            return;
        }

        adicionarEntradaNoDiario(texto, imagemURL);

        formEntrada.style.display = "none";
        btnAdicionar.style.display = "block";
        formEntrada.reset();
    });

    function adicionarEntradaNoDiario(texto, imagemURL) {
        const col = document.createElement("div");
        col.className = "col-6";
        let html = `<div class="diario-entry">${texto}</div>`;
        if (imagemURL) {
            html += `<img src="${imagemURL}" class="img-fluid rounded mt-2" alt="Imagem entrada">`;
        }
        col.innerHTML = html;
        diarioBox.prepend(col); // diariobox - elemento html, prepend(col) - insere o elemento col no início de diariobox, antes dos outros elementos filhos
    }

    async function carregarEntradasDiario(dataSelecionada = null) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) return;
        const user = userData.user;

        let dataFiltro;
        if (dataSelecionada) {
            dataFiltro = new Date(dataSelecionada);
        } else {
            dataFiltro = new Date();
        }
        const dataStr = dataFiltro.toISOString().slice(0, 10);

        const { data: entradas } = await supabase
            .from('diario_utente')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', dataStr + "T00:00:00")
            .lte('created_at', dataStr + "T23:59:59")
            .order('created_at', { ascending: false });

        diarioBox.innerHTML = ""; 
        if (entradas && entradas.length) {
            entradas.forEach(entrada => {
                adicionarEntradaNoDiario(entrada.texto, entrada.imagem_url);
            });
        }
    }
    carregarEntradasDiario();

    const dataPicker = document.getElementById("diarioDataPicker");
    if (dataPicker) {
        // Preenche com o dia de hoje por defeito
        dataPicker.value = new Date().toISOString().slice(0, 10);
        dataPicker.addEventListener("change", function () {
            carregarEntradasDiario(this.value);
        });
    }
}


// BOTÃO MOTIVAÇÃO
const motivacaoBtn = document.querySelector('.motivation-btn');
if (motivacaoBtn) {
    const frases = [
        "Acredita em ti! Cada dia é uma nova oportunidade.",
        "O progresso é feito de pequenos passos.",
        "És mais forte do que pensas.",
        "Nunca desistas dos teus sonhos.",
        "Cada recomeço é uma vitória.",
        "A tua jornada importa. Continua!",
        "Hoje é o melhor dia para começares de novo.",
        "O teu esforço vai valer a pena.",
        "Confia no processo. Vais conseguir!",
        "A tua coragem inspira!"
    ];

    function mostrarNotificacao(frase) {
        if (!("Notification" in window)) {
            alert(frase);
            return;
        }
        if (Notification.permission === "granted") {
            new Notification("Motivação STOP", { body: frase });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Motivação STOP", { body: frase });
                } else {
                    alert(frase);
                }
            });
        } else {
            alert(frase);
        }
    }

    motivacaoBtn.addEventListener('click', () => {
        const frase = frases[Math.floor(Math.random() * frases.length)];
        mostrarNotificacao(frase);
    });
}


// TAREFAS PROFISSIONAL
document.addEventListener("DOMContentLoaded", () => {
    const tasksList = document.getElementById("tasks-list");
    const addTaskBtn = document.getElementById("addTaskBtn");

    function criarTask(texto, id) {
        const div = document.createElement("div");
        div.className = "mb-3 p-3 bg-white d-flex justify-content-between align-items-center task-card";
        div.innerHTML = `
            <span class="fw-semibold text-primary">${texto}</span>
            <button class="btn btn-link btn-remover-task" title="Remover tarefa"><i class="bi bi-x-lg"></i></button>
        `;
        div.querySelector(".btn-remover-task").onclick = async () => {
            await removerTask(id);
            div.remove();
        };
        return div;
    }

    async function adicionarTaskSupabase(texto) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Faça login novamente.");
            return;
        }
        const user = userData.user;
        const { data, error } = await supabase
            .from('tarefas_profissional')
            .insert([{ user_id: user.id, texto }])
            .select()
            .single();
        if (error) {
            alert("Erro ao guardar tarefa: " + error.message);
            return null;
        }
        return data;
    }

    async function removerTask(id) {
        await supabase.from('tarefas_profissional').delete().eq('id', id);
    }

    async function carregarTasks() {
        tasksList.innerHTML = "";
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) return;
        const user = userData.user;
        const { data, error } = await supabase
            .from('tarefas_profissional')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
        if (data) {
            data.forEach(task => {
                tasksList.appendChild(criarTask(task.texto, task.id));
            });
        }
    }

    if (tasksList && addTaskBtn) {
        addTaskBtn.addEventListener("click", async () => {
            const texto = prompt("Nova tarefa:");
            if (texto && texto.trim()) {
                const novaTask = await adicionarTaskSupabase(texto.trim());
                if (novaTask) {
                    tasksList.appendChild(criarTask(novaTask.texto, novaTask.id));
                }
            }
        });

        carregarTasks();
    }
});


// PUBLICAÇÃO
const btnPublicar = document.getElementById("btnPublicar");
if (btnPublicar) {
    btnPublicar.addEventListener("click", async function (e) {
        e.preventDefault();

        const texto = document.getElementById("textoPublicacao").value.trim();
        const imagemInput = document.getElementById("fileUpload");
        let imagemURL = "";

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            return;
        }
        const user = userData.user;

        if (imagemInput.files && imagemInput.files[0]) {
            const file = imagemInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase
                .storage
                .from('publicacoesimagens')
                .upload(fileName, file);

            if (uploadError) {
                alert("Erro ao fazer upload da imagem: " + uploadError.message);
                return;
            }
            const { data: publicUrlData } = supabase
                .storage
                .from('publicacoesimagens')
                .getPublicUrl(fileName);
            imagemURL = publicUrlData.publicUrl;
        }

        const { error: insertError } = await supabase
            .from('publicacoes')
            .insert([{
                user_id: user.id,
                texto: texto,
                imagem_url: imagemURL
            }]);

        if (insertError) {
            alert("Erro ao publicar.");
            return;
        }

        window.location.href = "comunidade.html";
    });
}

// PUBLICAÇÕES
async function carregarPublicacoes() {
    const publicacoesList = document.getElementById("publicacoes-list");
    publicacoesList.innerHTML = "";

    const { data: publicacoes } = await supabase
        .from('publicacoes')
        .select('*')
        .order('created_at', { ascending: false });

    if (!publicacoes) return;

    for (const pub of publicacoes) {
        let avatar = "user.png";
        let nome = "";

        // Buscar nome de utente
        const { data: perfil } = await supabase
            .from('perfis_utentes')
            .select('username')
            .eq('user_id', pub.user_id)
            .maybeSingle();

        if (perfil && perfil.username) {
            nome = perfil.username;
        } else {
            // Buscar nome de profissional
            const { data: prof } = await supabase
                .from('perfis_profissionais')
                .select('username')
                .eq('user_id', pub.user_id)
                .maybeSingle();
            if (prof && prof.username) {
                nome = prof.username;
            } else {
                nome = "Utilizador";
            }
        }

        const div = document.createElement("div");
        div.className = "card mb-3";
        div.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center mb-2">
                    <img src="${avatar}" class="rounded-circle me-2" style="width:32px;height:32px;">
                    <span class="fw-bold">${nome}</span>
                </div>
                <div class="mb-2">${pub.texto ? pub.texto : ""}</div>
                ${pub.imagem_url ? `<img src="${pub.imagem_url}" class="img-fluid rounded mb-2" style="max-height:200px;" alt="" />` : ""}
                <div class="mb-2 comentarios" id="comentarios-${pub.id}"></div>
                <div>
                    <button class="btn btn-link text-danger p-0 me-3 btn-like" data-id="${pub.id}">
                        <i class="bi bi-heart"></i> <span class="like-count">${pub.likes || 0}</span>
                    </button>
                    <button class="btn btn-link text-primary p-0 btn-partilhar" data-id="${pub.id}"><i class="bi bi-share"></i></button>
                    ${await isProfissional() ? `<button class="btn btn-link text-secondary p-0 ms-3 btn-remover-pub" data-id="${pub.id}" title="Eliminar"><i class="bi bi-trash"></i></button>` : ""}
                </div>
            </div>
        `;
        publicacoesList.appendChild(div);
    }

    // Event listener para eliminar (só profissionais)
    document.querySelectorAll('.btn-remover-pub').forEach(btn => {
        btn.onclick = async function () {
            const id = this.getAttribute('data-id');
            if (confirm("Eliminar esta publicação?")) {
                await supabase.from('publicacoes').delete().eq('id', id);
                carregarPublicacoes();
            }
        };
    });

    // Event listener para like
    document.querySelectorAll('.btn-like').forEach(btn => { 
        btn.onclick = async function () {
            const id = this.getAttribute('data-id'); 

            const { data, error } = await supabase
                .from('publicacoes')
                .update({ likes: supabase.rpc('increment_likes', { pub_id: id }) })
                .eq('id', id)
                .select()
                .single();  
            if (!error && data) { // se não houve erro e há dados, atualiza o número de likes mostrado no botão
                this.querySelector('.like-count').textContent = (data.likes || 0);
            } else {
                // fallback se não usares função RPC
                let count = parseInt(this.querySelector('.like-count').textContent) || 0; // obtém o número atual de likes
                count++;
                this.querySelector('.like-count').textContent = count;
                await supabase.from('publicacoes').update({ likes: count }).eq('id', id);
            }
        };
    });

    // Event listener para partilhar
    document.querySelectorAll('.btn-partilhar').forEach(btn => {
        btn.onclick = async function () {
            const id = this.getAttribute('data-id');
            const url = `${window.location.origin}/comunidade.html#${id}`;
            if (navigator.share) {
                navigator.share({
                    title: 'Vê esta publicação!',
                    url: url
                });
            } else {
                await navigator.clipboard.writeText(url);
                alert("Link copiado para partilhar!");
            }
        };
    });
}

async function isProfissional() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return false;
    const { data: prof } = await supabase
        .from('perfis_profissionais')
        .select('user_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();
    return !!prof;
}

if (document.getElementById("publicacoes-list")) {
    carregarPublicacoes();
}


// CANCELAR PUBLICAÇÃO
const btnCancelar = document.querySelector('.header .btn-light');
if (btnCancelar) {
    btnCancelar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = "comunidade.html";
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const perfilNav = document.getElementById('perfilNav');
    if (!perfilNav) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;

    const { data: utente } = await supabase
        .from('perfis_utentes')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

    if (utente) {
        perfilNav.href = 'perfilU.html';
    } else {
        perfilNav.href = 'perfilP.html';
    }
});

// Redirecionamento baseado no tipo de perfil
const { data: userData } = await supabase.auth.getUser();
if (userData && userData.user) {
    const { data: utente } = await supabase
        .from('perfis_utentes')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();
    if (utente) {
        document.querySelector('.bottom-nav .nav-item[href="InicialP.html"]').setAttribute('href', 'ProgressoU.html');
    }
    document.querySelector('.bottom-nav .nav-item[href="ProgressoU.html"]')?.setAttribute('href', 'ProgressoU.html');
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log("Service Worker registado!", reg))
        .catch(err => console.error("Erro ao registar SW:", err));
}