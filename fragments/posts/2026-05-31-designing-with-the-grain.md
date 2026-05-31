---
title: "Designing with the Grain: Thoughts on Designing with AI"
date: 2026-05-31
excerpt: "Learnings from designing with the grain of AI."
tags: [design, ai, craft, process]
---

I recently had the opportunity to work on a fun little side project. I used it as a chance to explore what a fully AI-native workflow could look like. Spoiler alert: it felt like I was living in the future. By starting with AI (vs. trying to bolt it onto existing workflows), I was able to make the most of the material and explore concepts in a much more fluid, and quite frankly, fun, way.

It might be a stretch, but it reminded me of the [truth to materials](https://en.wikipedia.org/wiki/Truth_to_materials) philosophy and of some of my favorite architects like [Peter Zumthor](https://en.wikipedia.org/wiki/Peter_Zumthor), [Stanley Saitowitz](https://en.wikipedia.org/wiki/Stanley_Saitowitz), or [Alberto Ponis](https://pioniraproject.com/casa-hartley-alberto-ponis/). They lean into the material, work _with_ the stone or the concrete or the brick instead of trying to manipulating them into something they are not.

## Start from the story
Even before the current AI-craze, I was a firm believer that stories are a powerful way to bring your ideas to life and see if they feel right. Write the story of someone using the product. What's the context? What are they thinking? What are they feeling? What are they doing? If you write all that down and it feels forced or contrived, if you're asking yourself would anyone ever do this, then that's probably not the right experience (Looking at you [Shit User Stories](https://x.com/ShitUserStory)). Our brains, much like AI, are prediction machines. We're incredibly adept at detecting when A doesn't naturally lead to B. Stories without real causality or an internal logic don't hold. If you write it down and it feels natural, real, and captivating, you're on to something.

The nice thing in this new world is AI is _great_ with words. I fed it my narrative, broke it down into the major beats, each beat became a screen and with just a page or two of writing and a few prompts later I had a working prototype that brought the narrative to life. The story became the guide for AI to follow.

As Joan Didion put it, "we tell ourselves stories in order to live". For us product people, we tell ourselves stories in order to think.

## Triangulate to the destination
The best way to have a good idea is to have lots of ideas. But as we all embraced Figma and high-fidelity became the norm, exploring ideas became more and more expensive. Designers would explore one or two options in detail, researchers would test them, engineers would start costing them, and the team would quietly get attached. But two points isn't enough to triangulate. You'll confidently decide A is better than B and go build it when C was the answer all along.

AI makes the options part cheap. I could get a much richer lay of the land by exploring a lot more, quickly. And the ideas that didn't work out, that I ended up scrapping were just as important as the ones that I continued to make progress on. Each option in the solution space was getting me closer to the best answer for the problem at hand.

## Make principles operational
I've always had an aversion to fluffy principles that sound nice but don't actually say anything. Make it easy to use. Keep it simple. Be delightful. As if anyone would ever argue that things should be harder to use, more complex, and less enjoyable (See [Principles not Platitudes](https://blog.prototypr.io/principles-not-platitudes-d41a072d2d59) or Jared Spool's [Creating Great Design Principles](https://articles.centercentre.com/creating-design-principles/)). Building with AI, I found well-articulated principles with concrete examples were essential to steer it in the right direction. Out of the box, I was getting ok-ish results but the output felt generic. When I captured my principles in a design.md file, AI was able to get much closer to what I envisioned and keep things consistent and coherent across screens.

## Design in systems, not silos
We often work in slivers because we have to. Our working memory is small. Holding the full end-to-end flow in your head, every screen, every state, every edge case, is more than fits, so we zoom in on the one feature in front of us and trust the rest will line up later. With mocks, showing a thoughtful e2e flow meant building five screens before your feature even shows up and five after to land the journey. That's real work and most of it tedious, so we'd skip it and hope.

AI doesn't have those limits. Its context window is massive. I was able to hand AI the full picture at once and it was able to tell me if the pieces connected and flag where they didn't. The gaps surface while you're still designing, not three sprints later or in some review forum.

## Work with the grain
Zumthor doesn't fight the quartzite or the concrete. He simply lets the materials be themselves. AI feels like it has a grain as well. Most of what felt smooth on this project came from working with the grain instead of cutting across it.

Its grain is language, so start from a story. Its grain is options, so explore wide instead of betting early. Its grain is generic out of the box, so hand it your taste before you ask it for work. And its grain is holistic. It has the whole picture, so focus on complete experience instead of feeding it slivers.
