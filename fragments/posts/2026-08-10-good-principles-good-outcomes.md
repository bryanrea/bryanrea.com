---
title: "Good Principles, Good Outcomes"
date: 2026-08-10
excerpt: “Designers love design principles. Oftentimes they’re meaningless fluff.”
---
> Design principles are shared beliefs derived from experience and knowledge that guide design decisions towards achieving desired outcomes.

Just about every project that comes across my desk has a section on design principles. These principles, in theory, are meant to guide decision making and anchor design choices in something grander than the designer’s or product manager’s own opinions. The thinking goes, because these principles are true, and this design adheres to those principles, this must be the best design direction. Sounds great. While I applaud the desire to ground decisions in more than opinions, I’ve noticed these design “principles” often feel more like design [platitudes](https://blog.prototypr.io/principles-not-platitudes-d41a072d2d59) (“content is king”, “less is more"), meaningless phrases (“easy to use”), or worse, are just bold, extra large font single words (“Simple!”) that sound nice but are completely useless for actual decision making. Who wouldn't want something that's easy to use? Is anyone really going to argue to make it more complex?

Designers can be an insecure bunch. We want our designs to be bold, innovative, or unexpectedly clever but we also worry they will fall apart the second they go through the gauntlet of critique, reviews, and feedback. Deep down, we know a good chunk of design is actually subjective, or at the very least relative. We crave these principles so we can point at something besides "I just liked it more". 

Yet I rarely see designers actually applying the principles they spend so much time crafting in any meaningful way after that initial project kick off. Since they are mostly meaningless fluff, we tend to set them, forget them, and move on.

I've always been a big principles person. Principles reveal the underlying system, the logic, and the values that got you there. Tell me what's informing your decisions and I'll tell you if the designs make sense. With AI, I'm seeing principles becoming even _more_ essential as they are a way to steer AI in the right direction. LLMs have the world’s knowledge at their fingertips, but just like the people on your team, they need to know what matters and why to be able to make the right decisions. Good principles, good outcomes. Mediocre principles, mediocre outcomes. 

## What is a principle?
Let's start with a definition. Something I’ve never seen a designer do in all my years designing (myself included) is define what we mean by a design principle. We just sort of use them. What could go wrong? 

Reading through many definitions of principle, one challenge I see is the meaning of the word varies quite a bit depending on how you use it and those meanings can be in direct conflict with each other.

There's one sense of principle that means universal truth. From [Wikipedia](https://en.wikipedia.org/wiki/First_principle), “In philosophy and science, a first principle is a basic proposition or assumption that cannot be deduced from any other proposition or assumption.” These kinds of principles are the fundamental building blocks of reality. They are true because we say they are true and their truth is the foundation of many later derived truths. For example, the law of identity (e.g. A is A) or the law of non-contradiction (e.g. nothing can both be and not be the case in the same sense at the same time).

There’s another sense of principle that’s closer to a core belief. In his book [Principles](https://www.barnesandnoble.com/w/principles-ray-dalio/1125955035), Ray Dalio defines principles as “fundamental truths that guide behavior to achieve what you want in life”. These sorts of principles are more like rules or guidelines to steer actions and decisions towards a desired outcome. For example, Ray has a principle of radical transparency where information, including mistakes, should be visible to everyone, not hoarded or filtered on the way up or down. There’s nothing true or false about radical transparency, but it is useful to achieve his goal of improving individual and company performance. 

[Nielsen Norman Group](https://www.nngroup.com/articles/design-principles/) specifically defines design principles as “value statements that describe the most important goals that a product or service should deliver for users and are used to frame design decisions.” They make a point to differentiate these contextual belief-based principles from true “universal” principles of good design like hierarchy, contrast, or balance. These design principles feel even more subjective and further from the first definition focused on absolute truths. For example, Salesforce’s [Lightning Design System](https://www.lightningdesignsystem.com/2e1ef8501/p/67a7b2-foundations) has Clarity: simplicity drives momentum. [Airbnb](https://medium.com/airbnb-design/building-a-visual-language-behind-the-scenes-of-our-airbnb-design-system-224748775e4e) had at one point Universal: Airbnb is used around the world by a wide global community. Our products and visual language should be welcoming and accessible. This is where the meaningless fluff starts to creep in.

There’s an inherent tension in these definitions that helps explain why design principles can feel essential but often don’t get traction. On the one hand, principles are universal truths. On the other, they are just things we believe. One version of principles is meant to describe objective reality. Another version is meant to simply guide your own decision making. 

Side note: I just learned that a word with two contradicting definitions is a [contronym](https://www.merriam-webster.com/dictionary/contronym). Principle isn’t exactly a contronym, but close.

## Working definition
Looking across many different definitions of principle, there are few common elements we can use to get to a solid working definition.

Principles must:
- capture fundamental or derived truths
- represent knowledge and relationships 
- be reusable and flexible, can be applied in many situations
- help solve a problem or achieve an outcome
- be shared and believed by a group

Pulling it all together into a single definition: design principles are shared beliefs derived from experience and knowledge that guide design decisions towards achieving desired outcomes.

## What makes a good principle
I want to keep this simple. A good principle must be derived from experience or knowledge and it must help you make a decision. Deriving from experience or knowledge makes your principle relevant and believable. If your goal is to maximize successful account creation, and every time you’ve worked on a sign up flow you see more steps equals more drop off, a good principle would be: reduce steps to increase task completion. That principle also helps you make a decision, the other critical aspect of a good principle. If approach A has more steps than approach B, approach B is likely going to be the better starting point. If your principle doesn’t help with making a decision, toss it or revisit it. 

## What makes a bad principle
A bad principle then is one that isn’t grounded in actual experience or knowledge and it doesn't help you make a decision.  It's something that sounds nice but is irrelevant, inaccurate, or meaningless. The problem with something like Simple! isn't that we don’t want things to be simple. It’s that 1. it isn’t grounded in a deep understanding of what people actually need in a given context and 2. it doesn’t help you decide what makes one design simpler than another. That’s the actual heavy lifting a principle should be doing. A better version of Simple! then is making a statement about what you’ve observed makes something simpler like: use everyday language over technical accuracy for better comprehension or present one concept at a time, even if it means more steps. Those are statements you can actually use to evaluate your designs.

## AI needs good principles
Principled thinking was important before AI but good principles are becoming mission critical with AI in the mix. LLMs need to know what you care about and why to create consistently good, coherent output and decisions along the way. System instructions used to guide the model are essentially _all_ principles. You need to be able to clearly articulate to the model how it should be thinking. For example, my own team was really worried about response length. LLMs like to be verbose. We started with simple principles like “Be concise”. It’s exactly the kind of guidance that isn’t helpful because it doesn’t help the model understand when and why conciseness matters. A better version is “Match response length to the complexity of the question”. Simple questions should get simple replies. More complex questions might need more elaboration to provide a meaningful answer.

Good principles, good outcomes, even more so with AI acting on our behalf. Take time to stress test your principles, make sure they’re grounded in real experience or knowledge, and push on them until they actually help you make decisions. 