# Gera imagem compartilhavel de uma resenha do Ze (formato vertical para WhatsApp)
# Uso: python gerar_resenha_img.py [id-da-resenha] [arquivo-saida.png] [data-exibida]
import json
import sys
import os
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAMINHO_RESENHAS = os.path.join(RAIZ, "docs", "resenhas.json")
PASTA = os.path.join(RAIZ, "imagens")
if not os.path.isdir(PASTA):
    os.makedirs(PASTA)

ID_RESENHA = sys.argv[1] if len(sys.argv) > 1 else "especial-pagamentos"
DESTINO = os.path.join(PASTA, sys.argv[2] if len(sys.argv) > 2 else "resenha-pix.png")
DATA_EXIBIDA = sys.argv[3] if len(sys.argv) > 3 else "04/08/2026"

with open(CAMINHO_RESENHAS, encoding="utf-8") as arquivo:
    resenhas = json.load(arquivo)
resenha = next(r for r in resenhas if r["id"] == ID_RESENHA)

L = 1080
MARGEM = 60
LARGURA_UTIL = L - 2 * MARGEM

FUNDO = (10, 21, 16)
CARTAO = (19, 37, 28)
BORDA = (30, 54, 40)
LARANJA = (255, 122, 26)
LARANJA_CLARO = (255, 178, 100)
AMARELO = (255, 201, 51)
TEXTO = (207, 224, 213)
BRANCO = (240, 248, 243)
APAGADO = (120, 143, 128)

f_tag = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 30)
f_titulo = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 58)
f_bloco_titulo = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 34)
f_corpo = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 31)
f_assina = ImageFont.truetype("C:/Windows/Fonts/ariali.ttf", 27)
f_rodape = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 25)
f_emoji = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 40)
f_emoji_topo = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 84)

medidor = ImageDraw.Draw(Image.new("RGB", (10, 10)))

def quebrar(texto, fonte, largura):
    palavras = texto.split()
    linhas, atual = [], ""
    for palavra in palavras:
        teste = (atual + " " + palavra).strip()
        if medidor.textlength(teste, font=fonte) <= largura:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas

# Passo 1: medir a altura total
ALTURA_LINHA = 44
PAD_CARTAO = 30
GAP_CARTAO = 26

titulo_linhas = quebrar(resenha["titulo"], f_titulo, LARGURA_UTIL)
altura = 70 + 100 + 46 + len(titulo_linhas) * 70 + 30  # topo: emoji, tag, titulo

blocos_medidos = []
for bloco in resenha["blocos"]:
    corpo_linhas = quebrar(bloco["texto"], f_corpo, LARGURA_UTIL - 2 * PAD_CARTAO)
    altura_cartao = PAD_CARTAO + 46 + 14 + len(corpo_linhas) * ALTURA_LINHA + PAD_CARTAO
    blocos_medidos.append((bloco, corpo_linhas, altura_cartao))
    altura += altura_cartao + GAP_CARTAO

altura += 20 + 40 + 56 + 16  # assinatura + rodape + faixa

A = altura
img = Image.new("RGB", (L, A), FUNDO)
desenho = ImageDraw.Draw(img)

# Gradiente sutil no topo
topo_cor = (16, 42, 30)
for y in range(min(500, A)):
    t = y / 500
    cor = tuple(int(topo_cor[i] + (FUNDO[i] - topo_cor[i]) * t) for i in range(3))
    desenho.line([(0, y), (L, y)], fill=cor)

# Listras diagonais discretas
listras = Image.new("RGBA", (L, A), (0, 0, 0, 0))
d2 = ImageDraw.Draw(listras)
for x in range(-A, L + A, 140):
    d2.polygon([(x, 0), (x + 66, 0), (x + 66 - A, A), (x - A, A)], fill=(255, 255, 255, 5))
img = Image.alpha_composite(img.convert("RGBA"), listras).convert("RGB")
desenho = ImageDraw.Draw(img)

y = 64
# Cabecalho
desenho.text((MARGEM, y), "🎙️", font=f_emoji_topo, embedded_color=True)
desenho.text((MARGEM + 110, y + 6), "ZÉ RESENHA", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 52), fill=BRANCO)
desenho.text((MARGEM + 110, y + 66), "COMENTARISTA OFICIAL DA LIGA CARTOKA", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22), fill=APAGADO)
y += 118

# Etiqueta da edicao
if resenha.get("rotulo"):
    base_etiqueta = resenha["rotulo"]
elif resenha.get("rodada"):
    base_etiqueta = "Rodada " + str(resenha["rodada"])
else:
    base_etiqueta = "Edição especial"
etiqueta = base_etiqueta.upper() + " · " + DATA_EXIBIDA
larg_etiqueta = medidor.textlength(etiqueta, font=f_tag) + 36
desenho.rounded_rectangle([MARGEM, y, MARGEM + larg_etiqueta, y + 46], radius=23, fill=(56, 32, 12), outline=(140, 74, 24), width=2)
desenho.text((MARGEM + 18, y + 7), etiqueta, font=f_tag, fill=LARANJA_CLARO)
y += 66

for linha in titulo_linhas:
    desenho.text((MARGEM, y), linha, font=f_titulo, fill=AMARELO)
    y += 70
y += 30

for bloco, corpo_linhas, altura_cartao in blocos_medidos:
    desenho.rounded_rectangle([MARGEM, y, L - MARGEM, y + altura_cartao], radius=20, fill=CARTAO, outline=BORDA, width=2)
    desenho.rounded_rectangle([MARGEM, y + 14, MARGEM + 6, y + altura_cartao - 14], radius=3, fill=LARANJA)
    ty = y + PAD_CARTAO
    desenho.text((MARGEM + PAD_CARTAO, ty - 6), bloco["icone"], font=f_emoji, embedded_color=True)
    desenho.text((MARGEM + PAD_CARTAO + 58, ty), bloco["titulo"].upper(), font=f_bloco_titulo, fill=LARANJA_CLARO)
    ty += 46 + 14
    for linha in corpo_linhas:
        desenho.text((MARGEM + PAD_CARTAO, ty), linha, font=f_corpo, fill=TEXTO)
        ty += ALTURA_LINHA
    y += altura_cartao + GAP_CARTAO

y += 6
assinatura = "Zé Resenha · comentarista oficial da liga"
desenho.text((L - MARGEM - medidor.textlength(assinatura, font=f_assina), y), assinatura, font=f_assina, fill=APAGADO)
y += 48
rodape = "fabriciokaempf.github.io/liga-cartoka-2026"
desenho.text((MARGEM, y), "Liga Cartoka de pontos corridos 2026 · " + rodape, font=f_rodape, fill=APAGADO)

# Faixa Brasil no rodape
faixa = 16
terco = L // 3
desenho.rectangle([0, A - faixa, terco, A], fill=(0, 156, 59))
desenho.rectangle([terco, A - faixa, terco * 2, A], fill=(255, 204, 41))
desenho.rectangle([terco * 2, A - faixa, L, A], fill=(255, 122, 26))

img.save(DESTINO, optimize=True)
import os
print("gerado:", DESTINO, "|", img.size[0], "x", img.size[1], "|", os.path.getsize(DESTINO) // 1024, "KB")
