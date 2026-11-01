import { NextResponse } from "next/server";
import { collection } from "@/data/collection";

// System prompt defining Aurelle's luxury stylist voice
const SYSTEM_PROMPT = `
You are the Haute Couture AI Stylist for AURELLE, an ultra-luxury Parisian/Milanese eveningwear house.
Collection Theme: "AFTER DARK" — Five chapters, five personalities for one unforgettable night.

The Collection:
1. "The Prelude" (01 - Arrival): Asymmetric one-shoulder cocktail midi, structured bodice with hidden boning, silk satin and crushed velvet contrast panels. Colors: Midnight Black & Antique Gold. Best for: Sophisticated entrances, cocktail galas, soirées.
2. "The Flapper" (02 - Celebration): 1920s Art Deco reinterpretation, straight shift silhouette, dropped waist, 8,000+ hand-sewn glass beads, triple-tier moving silk fringe. Colors: Onyx & Champagne. Best for: Dancing, celebration, high-energy galas.
3. "The Spotlight" (03 - The Moment): Deep emerald green column gown with high slit and optional 1.2m detachable train, sculptural twisted shoulder knot, built-in corsetry, fabric-covered back buttons. Best for: Red carpets, award ceremonies, formal climax of the evening.
4. "The Afterglow" (04 - The Energy): Liquid silver metallic lamé jumpsuit, plunging neckline, corset bodice, wide-leg palazzo trousers, statement metallic belt. Best for: Contemporary power dressing, gallery vernissages, high-fashion events.
5. "Midnight Rebel" (05 - Last Dance): Asymmetric black and burgundy velvet mini, single sculptural long sleeve, bare shoulder, sheer mesh waist inserts, antique silver hardware. Best for: Late-night after-parties, avant-garde affairs.

Guidelines:
- Tone: Poetic, refined, highly knowledgeable, polite, speaking as an intimate atelier confidante.
- Always recommend specific pieces from the collection when suitable.
- Provide sizing, styling, and fabric advice when asked.
- Keep responses concise (2 to 4 paragraphs maximum), elegant, and focused on dressing the client for their night.
`;

function getMockStylistResponse(prompt: string): { reply: string; suggestedDressId?: string; suggestions?: string[] } {
  const query = prompt.toLowerCase();

  if (query.includes("spotlight") || query.includes("emerald") || query.includes("train") || query.includes("red carpet") || query.includes("award") || query.includes("formal dinner")) {
    return {
      reply: `For a moment of undeniable gravitas, **Chapter 03 · The Spotlight** is the ultimate choice. Crafted from heavyweight Duchess Satin in a deep imperial emerald, it features a sculptural shoulder knot and an optional 1.2-meter detachable train that glides down the red carpet, then unclips effortlessly for seated dinner.\n\nPair it with minimal emerald or diamond drop earrings and allow the gown's architectural slit and liquid drape to command the entire room.`,
      suggestedDressId: "spotlight",
      suggestions: ["How does sizing run on The Spotlight?", "Tell me about The Prelude", "Book an Atelier Consultation"],
    };
  }

  if (query.includes("flapper") || query.includes("dance") || query.includes("dancing") || query.includes("fringe") || query.includes("celebrat") || query.includes("1920") || query.includes("party")) {
    return {
      reply: `When the music begins and the night calls for dynamic celebration, nothing compares to **Chapter 02 · The Flapper**. Featuring over 8,000 hand-applied glass beads arranged in Art Deco geometric motifs and a triple-tier silk fringe hem, it moves like liquid champagne with every turn.\n\nLined in nude silk charmeuse, it feels weightless against the skin. Style it with strappy onyx stilettos and let the kinetic fringe do the storytelling.`,
      suggestedDressId: "flapper",
      suggestions: ["What sizes are available for The Flapper?", "Tell me about The Afterglow jumpsuit", "Can I order custom alterations?"],
    };
  }

  if (query.includes("prelude") || query.includes("arrival") || query.includes("first") || query.includes("cocktail") || query.includes("one-shoulder") || query.includes("midi") || query.includes("velvet")) {
    return {
      reply: `For your initial entrance, **Chapter 01 · The Prelude** embodies power through calculated restraint. The asymmetric one-shoulder cut is balanced with a sculptured bodice with concealed boning channels, juxtaposing liquid silk satin against deep crushed velvet at the hip fold.\n\nIt commands the room without whispering a word. Accentuate the neckline with an antique gold cuff and let the garment’s clean French seams elongate your silhouette.`,
      suggestedDressId: "prelude",
      suggestions: ["Explore The Spotlight gown", "How to care for satin and velvet?", "View client reviews"],
    };
  }

  if (query.includes("afterglow") || query.includes("jumpsuit") || query.includes("silver") || query.includes("suit") || query.includes("pant") || query.includes("trouser") || query.includes("modern")) {
    return {
      reply: `If you desire modern sartorial armour, **Chapter 04 · The Afterglow** is second to none. This wide-leg palazzo jumpsuit is cut from reflective liquid-metal lamé that ripples like molten silver under gallery or venue lights.\n\nThe plunging corset bodice is boned for immaculate posture, cinched by a removable metallic belt with a geometric buckle. It is bold, statuesque, and thoroughly unforgettable.`,
      suggestedDressId: "afterglow",
      suggestions: ["Is The Afterglow lined?", "Compare with Midnight Rebel", "Request an Atelier Enquiry"],
    };
  }

  if (query.includes("rebel") || query.includes("midnight") || query.includes("last dance") || query.includes("burgundy") || query.includes("mini") || query.includes("afterparty") || query.includes("after party") || query.includes("club") || query.includes("edgy")) {
    return {
      reply: `For the electric hours after midnight, **Chapter 05 · Midnight Rebel** owns the final dance. This daring mini pairs deep burgundy and onyx velvet with sheer mesh waist panels and an asymmetric single sculptural sleeve.\n\nAccented with antique silver chain hardware, it offers an alluring, fearless contrast between structured corsetry and sheer skin reveal.`,
      suggestedDressId: "midnight-rebel",
      suggestions: ["Tell me about The Prelude", "What size should I choose?", "How can I book an appointment?"],
    };
  }

  if (query.includes("size") || query.includes("sizing") || query.includes("fit") || query.includes("measurement")) {
    return {
      reply: `Our atelier designs run from **XS to XXL** (FR 34–44 / US 2–12):\n\n• **The Prelude**: Cut true to size with an internal structured corset.\n• **The Flapper**: Relaxed shift cut; size down if you prefer a closer silhouette.\n• **The Spotlight**: Sculpted body-skimming cut; if you are between sizes, we recommend sizing up.\n• **The Afterglow**: Fitted through the bodice with a generous palazzo leg.\n• **Midnight Rebel**: Very fitted with minimal stretch; order your exact size or one size up for comfort.\n\nOur atelier also provides bespoke size consultations upon request.`,
      suggestions: ["Recommend a look for my body type", "Explore The Spotlight", "Request a Private Consultation"],
    };
  }

  if (query.includes("material") || query.includes("fabric") || query.includes("craft") || query.includes("care") || query.includes("silk") || query.includes("clean")) {
    return {
      reply: `AURELLE garments are crafted exclusively from archival-grade textiles:\n\n• **Duchess Satin**: Heavyweight, lustrous silk that reflects light with architectural crispness.\n• **Crushed Velvet**: Deep pile engineered to absorb flash photography with velvety depth.\n• **Beaded Tulle**: Over 8,000 hand-applied glass beads sewn in heritage workshops.\n• **Liquid Lamé**: Fluid metallic jersey that moves without stiffness or static.\n\nAll pieces are fully lined in ivory or nude silk and require specialist dry cleaning to preserve their artisanal finishes.`,
      suggestions: ["Which dress is best for a summer gala?", "Tell me about The Flapper", "Contact Atelier Support"],
    };
  }

  if (query.includes("price") || query.includes("cost") || query.includes("buy") || query.includes("order") || query.includes("purchase") || query.includes("appointment") || query.includes("contact")) {
    return {
      reply: `Each creation from the **After Dark** collection is made in limited editions to safeguard exclusivity. You can place an enquiry directly through our website by pressing **REQUEST ENQUIRY** or booking a private salon consultation with our master couturiers.\n\nOur atelier will contact you within 24 hours to arrange measurements, delivery timelines, or private viewing options.`,
      suggestions: ["Recommend a dress for a gala", "View collection overview", "Tell me about The Spotlight"],
    };
  }

  return {
    reply: `Good evening. Welcome to the House of Aurelle. I am delighted to assist with your wardrobe for tonight.\n\nOur **After Dark** collection presents five distinct chapters: from the poised arrival of **The Prelude**, through the jubilant rhythm of **The Flapper**, the arresting climax of **The Spotlight**, the liquid brilliance of **The Afterglow**, to the nocturnal defiance of **Midnight Rebel**.\n\nTell me about the occasion, venue, or mood you wish to evoke, and allow me to curate the quintessential garment for your night.`,
    suggestions: [
      "Recommend a dress for a black-tie gala",
      "Which dress is best for dancing?",
      "Tell me about sizing and fit",
      "Show me The Spotlight gown",
    ],
  };
}

export async function POST(req: Request) {
  try {
    const { messages, apiKey: clientApiKey } = await req.json();
    const lastMessage = messages?.[messages.length - 1]?.content || "";

    const activeApiKey =
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.AI_API_KEY;

    // 1. If Gemini API key is provided, use real Gemini Interactions API
    if (activeApiKey && (activeApiKey.startsWith("AIza") || process.env.GEMINI_API_KEY)) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${SYSTEM_PROMPT}\n\nClient inquiry: ${lastMessage}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            // Check if any dress is mentioned
            let suggestedDressId: string | undefined = undefined;
            const lower = generatedText.toLowerCase();
            if (lower.includes("spotlight")) suggestedDressId = "spotlight";
            else if (lower.includes("flapper")) suggestedDressId = "flapper";
            else if (lower.includes("prelude")) suggestedDressId = "prelude";
            else if (lower.includes("afterglow")) suggestedDressId = "afterglow";
            else if (lower.includes("midnight rebel") || lower.includes("rebel")) suggestedDressId = "midnight-rebel";

            return NextResponse.json({
              reply: generatedText,
              suggestedDressId,
              source: "gemini",
            });
          }
        }
      } catch (err) {
        console.warn("Live AI key call failed, falling back to Atelier Intelligence:", err);
      }
    }

    // 2. If OpenAI API key is provided
    if (activeApiKey && activeApiKey.startsWith("sk-")) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m: { role: string; content: string }) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              })),
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            let suggestedDressId: string | undefined = undefined;
            const lower = reply.toLowerCase();
            if (lower.includes("spotlight")) suggestedDressId = "spotlight";
            else if (lower.includes("flapper")) suggestedDressId = "flapper";
            else if (lower.includes("prelude")) suggestedDressId = "prelude";
            else if (lower.includes("afterglow")) suggestedDressId = "afterglow";
            else if (lower.includes("midnight rebel") || lower.includes("rebel")) suggestedDressId = "midnight-rebel";

            return NextResponse.json({
              reply,
              suggestedDressId,
              source: "openai",
            });
          }
        }
      } catch (err) {
        console.warn("OpenAI call failed, falling back to Atelier Intelligence:", err);
      }
    }

    // 3. Built-in Atelier Intelligence Engine (works seamlessly without an API key)
    const simulated = getMockStylistResponse(lastMessage);
    return NextResponse.json({
      reply: simulated.reply,
      suggestedDressId: simulated.suggestedDressId,
      suggestions: simulated.suggestions,
      source: "atelier-engine",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Pardon me, our atelier records are momentary resting. How may I otherwise guide your evening styling?",
        source: "fallback",
      },
      { status: 200 }
    );
  }
}

