---
number: "02"
title: Continual Learning for Generative Models
shortTitle: Continual Learning
colour: cl
supervisor: Luca Cagliero
coSupervisor: Elena Baralis
status: approved
summary: >-
  Training Multimodal Large Language Models (MLLMs) is inherently dynamic as data distributions, languages and
  user demands continually evolve. Continual Learning (CL) aims to adapt models for new tasks, languages, and
  domains without forgetting prior knowledge and capabilities. While CL for discriminative models is
  established, its use for generative models poses relevant challenges. The scholarship aims to study
  innovative CL approaches suited for Small MLLMs and apply them in real scenarios.
---

## Context

Large Language Models (LLMs) are one of the most disruptive technologies of the last years as they are revolutionizing information access, creativity, and text processing tasks. Beyond understanding and generating text in natural language, recently proposed LLMs also support visual, video, and acoustic content as part of the instruction prompts or responses. Multimodal LLMs rely on large-scale generative pre-training, fine-tuning, and human alignment. These processes are inherently dynamic, as languages, data distributions, and user demands continually evolve. When a new model has been trained, it is practically infeasible to account for all possible future scenarios in advance. Therefore, pretrained, fine-tuned, and reward models need to be incrementally updated throughout their lifetime. Such a dynamic scenario is commonly denoted by Continual Learning (CL, in short) [1].

## Challenges

Due to the significant costs of data annotation and training, a relevant aspect is the opportunistic reuse of past annotations/models/rewards to address new tasks/domains/scenarios. CL performance is often limited by catastrophic forgetting, where learning a new task usually results in a dramatic performance drop of the old tasks [2]. Generative models like textual LLMs and Multimodal LLMs not only demand the incremental updating of predictive models, but also the capability to produce novel content grounded in perceptual understanding [3].

## Research objectives

- Benchmarking Existing CL techniques for textual generative models;
- Extend CL techniques for textual LLMs towards multimodal scenarios;
- Transfer CL models from one domain to another, from one language to another, and from one modality to another;
- Propose new foundational CL models, including Reinforced CL techniques [4,5];
- Study new strategies to fight catastrophic forgetting in challenging scenarios;
- Generalize CL approaches to make them agnostic to data modality and language;
- Explore new, challenging application scenarios.

## Tentative work plan

During the first year, the PhD student will study existing generative CL techniques and compare them with CL solutions for discriminative models. Focusing on textual models first, the PhD will investigate new approaches for adding languages, domains, and tasks. In parallel, the research will explore the suitability of multimodal strategies to extend the transferability of CL techniques from one modality to another.

In the second year, the PhD student will present new CL approaches, including innovative techniques based on Reinforced CL, and test them on benchmark and real-world data. The research will also address open issues related to catastrophic forgetting.

In the last year, the PhD student will extend the prior work towards cross-modal, cross-lingual and modality-agnostic scenarios.

## Bibliography

1. L. Wang, X. Zhang, H. Su and J. Zhu, "A Comprehensive Survey of Continual Learning: Theory, Method and Application," in IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 46, no. 8, pp. 5362-5383, Aug. 2024, doi: [10.1109/TPAMI.2024.3367329](https://doi.org/10.1109/TPAMI.2024.3367329).
2. M. McCloskey and N. J. Cohen, "Catastrophic interference in connectionist networks: The sequential learning problem," Psychol. Learn. Motivation, vol. 24, pp. 109-165, 1989, doi: <https://doi.org/10.1016/S0079-7421(08)60536-8>
3. Guo, H., Zeng, F., Zhu, F., Wang, J., Wang, X., Zhou, J., and Liu, C. L. (2025). Continual learning for generative ai: From LLMs to MLLMs and beyond. arXiv preprint [arXiv:2506.13045](https://arxiv.org/abs/2506.13045).
4. Ju Xu and Zhanxing Zhu. 2018. Reinforced continual learning. In Proceedings of the 32nd International Conference on Neural Information Processing Systems (NIPS'18). Curran Associates Inc., Red Hook, NY, USA, 907-916.
5. Continual Learning as Computationally Constrained Reinforcement Learning Kumar, S., Marklund, H., Rao, A., Zhu, Y., Hong, J. J., Yueyang L., Van Roy, B.2025, Foundations and Trends in Machine Learning
