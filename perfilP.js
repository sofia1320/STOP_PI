import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://xtsrzfljmsljlpqevnca.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0c3J6ZmxqbXNsamxwcWV2bmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTAzNzMsImV4cCI6MjA2NDYyNjM3M30.oefIQNt4J1S8GzhYRnF8ZpbFOb5pRIzMFyCkB_To5fc');

export async function preencherPerfilProfissionalForm() {
    const perfilForm = document.getElementById("perfilForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const specialtyInput = document.getElementById("specialty");
    const profileImagePreview = document.getElementById("profileImagePreview");

    if (!perfilForm || !usernameInput || !emailInput || !specialtyInput || !profileImagePreview) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;
    const user = userData.user;

    const { data: perfil } = await supabase
        .from('perfis_profissionais')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    if (perfil) {
        usernameInput.value = perfil.username || "";
        specialtyInput.value = perfil.especialidade_psicologia || "";
        if (perfil.foto_url) {
            profileImagePreview.src = perfil.foto_url;
        }
    }
    emailInput.value = user.email || "";
}

// Atualizar dados
export async function atualizarPerfilProfissionalForm() {
    const perfilForm = document.getElementById("perfilForm");
    const usernameInput = document.getElementById("username");
    const specialtyInput = document.getElementById("specialty");
    const profileImageInput = document.getElementById("profileImageInput");
    const profileImagePreview = document.getElementById("profileImagePreview");

    if (!perfilForm || !usernameInput || !specialtyInput) return false;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return false;
    const user = userData.user;

    let foto_url = profileImagePreview ? profileImagePreview.src : "";

    // Upload da imagem se houver nova imagem selecionada
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
        // Obter URL público
        const { data: publicUrlData } = supabase
            .storage
            .from('perfilimagens')
            .getPublicUrl(fileName);
        if (publicUrlData && publicUrlData.publicUrl) {
            foto_url = publicUrlData.publicUrl;
        }
    }

    const { error } = await supabase
        .from('perfis_profissionais')
        .update({
            username: usernameInput.value,
            especialidade_psicologia: specialtyInput.value,
            foto_url: foto_url
        })
        .eq('user_id', user.id);

    return !error;
}

document.addEventListener('DOMContentLoaded', () => {
    preencherPerfilProfissionalForm();

    const perfilForm = document.getElementById("perfilForm");
    if (perfilForm) {
        perfilForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const sucesso = await atualizarPerfilProfissionalForm();
            if (sucesso) {
                alert("Perfil atualizado com sucesso!");
            }
        });
    }

    // Pré-visualização da imagem
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