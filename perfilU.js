import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://xtsrzfljmsljlpqevnca.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0c3J6ZmxqbXNsamxwcWV2bmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTAzNzMsImV4cCI6MjA2NDYyNjM3M30.oefIQNt4J1S8GzhYRnF8ZpbFOb5pRIzMFyCkB_To5fc');

export async function preencherPerfilUtenteForm() {
    const perfilForm = document.getElementById("perfilForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const addictionTypeInput = document.getElementById("addictionType");

    if (!perfilForm || !usernameInput || !emailInput || !addictionTypeInput) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;
    const user = userData.user;

    const { data: perfil } = await supabase
        .from('perfis_utentes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    if (perfil) {
        usernameInput.value = perfil.username || "";
        addictionTypeInput.value = perfil.tipo_vicio || "";
    }
    emailInput.value = user.email || "";
}

export async function atualizarPerfilUtenteForm() {
    const perfilForm = document.getElementById("perfilForm");
    const usernameInput = document.getElementById("username");
    const addictionTypeInput = document.getElementById("addictionType");
    const profileImageInput = document.getElementById("profileImageInput");
    const profileImagePreview = document.getElementById("profileImagePreview");

    if (!perfilForm || !usernameInput || !addictionTypeInput) return false;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return false;
    const user = userData.user;

    let foto_url = profileImagePreview.src;

    if (profileImageInput && profileImageInput.files && profileImageInput.files[0]) {
        const file = profileImageInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_profile.${fileExt}`;
        const { error: uploadError } = await supabase
            .storage
            .from('perfilimagens')
            .upload(fileName, file, { upsert: true });
        if (uploadError) {
            alert("Erro ao fazer upload da imagem: " + uploadError.message);
            return false;
        }
        const { data: publicUrlData } = supabase
            .storage
            .from('perfilimagens')
            .getPublicUrl(fileName);
        if (publicUrlData && publicUrlData.publicUrl) {
            foto_url = publicUrlData.publicUrl;
        }
    }

    const { error } = await supabase
        .from('perfis_utentes')
        .update({
            username: usernameInput.value,
            tipo_vicio: addictionTypeInput.value,
            foto_url: foto_url
        })
        .eq('user_id', user.id);

    return !error;
}

document.addEventListener('DOMContentLoaded', () => {
    preencherPerfilUtenteForm();

    const perfilForm = document.getElementById("perfilForm");
    if (perfilForm) {
        perfilForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const sucesso = await atualizarPerfilUtenteForm();
            if (sucesso) {
                alert("Perfil atualizado com sucesso!");
            } else {
                alert("Erro ao atualizar perfil.");
            }
        });
    }

    const profileImageInput = document.getElementById('profileImageInput');
    const profileImagePreview = document.getElementById('profileImagePreview');

    if (profileImageInput && profileImagePreview) {
        profileImageInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                profileImagePreview.src = URL.createObjectURL(file);
            }
        });
    }
});

document.getElementById('logoutBtn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
};


