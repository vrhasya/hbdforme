const escapeHtml = (value="") => String(value).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: {"Content-Type":"application/json"}, body: JSON.stringify({error:"Method not allowed"}) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const name = String(body.name || "Anonymous").trim().slice(0,60) || "Anonymous";
    const message = String(body.message || "").trim().slice(0,800);
    if (!message) return {statusCode:400,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Ucapan tidak boleh kosong."})};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_LOG_CHAT_ID;
    const topicId = process.env.TELEGRAM_LOG_TOPIC_ID;

    if (!token || !chatId) {
      return {statusCode:500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Telegram belum dikonfigurasi di Netlify."})};
    }

    const now = new Intl.DateTimeFormat("id-ID",{dateStyle:"full",timeStyle:"medium",timeZone:"Asia/Jakarta"}).format(new Date());
    const wishId = "WISH-" + Math.random().toString(36).slice(2,8).toUpperCase();

    const text = `🎂 <b>BIRTHDAY WISH LOG</b>\n\n👤 <b>Dari</b>\n${escapeHtml(name)}\n\n💬 <b>Ucapan</b>\n${escapeHtml(message)}\n\n🌐 <b>Source</b>\nLuxury Birthday Experience\n\n📅 <b>Waktu</b>\n${escapeHtml(now)}\n\n🆔 <b>ID</b>\n<code>${wishId}</code>`;

    const payload = {chat_id:chatId,text,parse_mode:"HTML",disable_web_page_preview:true};
    if (topicId) payload.message_thread_id = Number(topicId);

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
    });
    const result = await tg.json();

    if (!tg.ok || !result.ok) {
      return {statusCode:502,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Telegram gagal menerima ucapan."})};
    }

    return {statusCode:200,headers:{"Content-Type":"application/json"},body:JSON.stringify({ok:true,wishId})};
  } catch (error) {
    return {statusCode:500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Terjadi kesalahan pada server."})};
  }
};
