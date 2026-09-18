---
number: "04"
title: Time-Aware Reinforcement Learning from AI Feedback
shortTitle: Time-Aware RLAIF
colour: rlaif
supervisor: Luca Cagliero
coSupervisor: Paolo Garza
phdStudent: Davide Benotto
status: approved
summary: >-
  Reinforcement Learning from AI Feedback (RLAIF) has been developed to mitigate the substantial expenses
  involved in acquiring human preferences. With the seamless advances of Multimodal LLMs, RLAIF has become
  fundamental to complement human feedback for model fine-tuning, but temporal model drift and time-evolving
  application scenarios pose significant challenges. The scholarship aims to adapt RLAIF for time-evolving
  scenarios, mainly focusing on real applications of SpeechLLMs and VisionLLMs.
---

## Context

Reinforcement Learning from Human Feedback (RLHF) is an established technique for aligning language models to human preferences [1]. However, since the cost of human annotation is often unaffordable, RL commonly uses a reward model trained on a mix of human and AI preferences [2].

## Challenges

To overcome RLHF issues, Reinforcement Learning from AI Feedback (RLAIF) has successfully been applied in several domains, ranging from hate speech detection and mitigation [3] to SpeechLLM fine-tuning [4]. However, most RLAIF-based solutions often assume that the AI feedback is collected once, without incremental updating, and the model to be fine-tuned is static. When a temporal drift occurs, new AI feedback is required, and time-evolving/streaming models and Reinforcement Learning strategies become necessary.

## Research objectives

- Benchmarking Existing RLAIF techniques on speechLLMs, VisualLLMs, and VideoLLMs;
- Extend RLAIF techniques towards different modalities, contexts of application, and data distributions;
- Propose new, efficient time-evolving approaches to RLAIF;
- Adapt RLAIF techniques to incremental/streaming scenarios;
- Define new performance metrics to capture RLAIF effectiveness and efficiency in time-evolving scenarios;
- Develop Agentic AI solutions incorporating RLAIF;
- Explain AI agents' decisions in time-evolving RLAIF scenarios.

## Tentative work plan

During the first year, the PhD student will study existing RLAIF techniques and compare them with RLHF approaches for model fine-tuning. Focusing on speechLLMs first, the PhD investigates new approaches to adapt RLAIF to time-evolving scenarios, with particular attention paid to incremental/streaming scenarios.

In the second year, the PhD student will extend the research to other data modalities (e.g., visual content, time series), studying original approaches to efficiently make RLAIF and RL-based fine-tuning techniques time-aware. The PhD student will also develop Agentic AI framework incorporating time-aware RLAIF techniques.

In the last year, the PhD student will further explore RLAIF applications, particularly on Agentic AI, and studies how to explain AI agents' decisions, and how to measure the quality of LLM-as-a-judge models in time-evolving scenarios.

## Bibliography

1. Learning from human preferences. Amodei, Dario; Christiano, Paul; Ray, Alex. Openai.com.
2. RLAIF vs. RLHF: Scaling Reinforcement Learning from Human Feedback with AI Feedback. Harrison Lee, Samrat Phatale, Hassan Mansoor, Thomas Mesnard, Johan Ferret, Kellie Lu, Colton Bishop, Ethan Hall, Victor Carbune, Abhinav Rastogi, Sushant Prakash. <https://arxiv.org/abs/2309.00267>
3. A. Albladi et al., "Hate Speech Detection Using Large Language Models: A Comprehensive Review," in IEEE Access, vol. 13, pp. 20871-20892, 2025, doi: [10.1109/ACCESS.2025.3532397](https://doi.org/10.1109/ACCESS.2025.3532397).
4. WavReward: Spoken Dialogue Models With Generalist Reward Evaluators. Shengpeng Ji, Tianle Liang, Yangzhuo Li, Jialong Zuo, Minghui Fang, Jinzheng He, Yifu Chen, Zhengqing Liu, Ziyue Jiang, Xize Cheng, Siqi Zheng, Jin Xu, Junyang Lin, Zhou Zhao. 2025
5. A Comprehensive Survey of LLM Alignment Techniques: RLHF, RLAIF, PPO, DPO and More. Zhichao Wang, Bin Bi, Shiva Kumar Pentyala, Kiran Ramnath, Sougata Chaudhuri, Shubham Mehrotra, Zixu (James)Zhu, Xiang-Bo Mao, Sitaram Asur, Na (Claire) Cheng. <https://arxiv.org/abs/2407.16216>
