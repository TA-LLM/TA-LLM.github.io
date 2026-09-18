---
number: "03"
title: Topology-Aware Temporal Reasoning
shortTitle: Topology-Aware Reasoning
colour: topology
supervisor: Luca Cagliero
coSupervisor: Francesco Vaccarino
status: approved
summary: >-
  Large Language Models (LLMs) excel at complex reasoning and solving generative tasks on text and multimodal
  data. However, they face challenges with Temporal Reasoning (TR), which involves understanding not only
  time-related concepts, such as ordering or duration, but also more intricate aspects, such as planning and
  causal relation discovery. The scholarship studies the use of topological analysis to address the
  limitations of LLMs in TR and evaluate LLM's robustness in dynamic scenarios.
---

## Context

Temporal Reasoning (TR) requires a combination of various skills including mathematical and logical reasoning as well as commonsense knowledge [1,2]. Addressing TR on multimodal databases including, for instance, time series, audio tracks, documents, and images, involves training and fine-tuning multimodal learning architectures, such as transformers and Multimodal Large Language Models (MLLMs), to incorporate the notion of time and effectively handle time-evolving scenarios.

## Challenges

Latent representations of text and multimodal data often struggle to capture temporal or time-evolving patterns. To effectively address temporal learning tasks, such as the detection of distribution shifts, innovative representations of text and multimodal content are necessary. Large Language Models outcomes can learn complex phenomena, but still exhibit limitations due to LLM non-determinism, drifts in models' parameters, hallucination, and bias. The problem of assessing the robustness of Large Language Models in time-evolving settings is still open.

Specializing Multimodal Large Language Models is known to be particularly costly due to the combined need for extensive computational resources and large training datasets. Parameter-Efficient Fine-Tuning strategies aim to alleviate the cost of model fine-tuning, but their suitability to time-evolving scenarios remains questionable. The study of innotivate, general-purpose solutions tailored to long contexts and time-variant scenarios is of primary interest for the research community.

## Research objectives

- Benchmark textual and multimodal Large Language Models on temporal reasoning tasks.
- Design, implement, and test new approaches based on topological analysis of latent space in time-evolving scenarios.
- Adopt stochastic models to learn temporal dynamics, analyze distribution drifts, and intepret/validate the LLM performance.
- Define strategies to assess LLM robustness in dynamic settings;
- Propose and test topology-aware strategies for Parameter-Efficient Fine-Tuning of textual and multimodal LLMs.

## Tentative work plan

During the first year, the PhD student will study existing temporal reasoning approaches for textual and multimodal LLMs. Focusing on the issues of temporal drift and distribution shifts, the goal is also to explore new latent representations of text and multimodal content capturing persistent topological structures.

In the second year, the PhD student will complete the analysis of latent representations and extend the study of LLMs and Multimodal LLM capabilities for TR by also exploring the assessment of the model robustness and the study, development, and testing of new applications suited to real-world dynamic scenarios.

Beyond extending the scope of prior studies to multiple modalities and application contexts, in the last year the PhD student will propose new Parameter-Efficient Fine-Tuning strategies incorporating topological information.

## Bibliography

1. Large Language Models Can Learn Temporal Reasoning. Siheng Xiong, Ali Payani, Ramana Kompella, Faramarz Fekri. ACL 2024. <https://aclanthology.org/2024.acl-long.563.pdf>
2. Timedial: Temporal commonsense reasoning in dialog. Lianhui Qin, Aditya Gupta, Shyam Upadhyay, Luheng He, Yejin Choi, and Manaal Faruqui. ACL 2021.
3. Probing Neural Topology of Large Language Models. Yu Zheng, Yuan Yuan, Yue Zhuo, Yong Li, Gabriel Kreiman, Tomaso Poggio, Paolo Santi. <https://arxiv.org/abs/2506.01042>
4. Reasoning Topology Matters: Network-of-Thought for Complex Reasoning Tasks. Fan Huang. <https://arxiv.org/abs/2603.20730>
5. TopoCL: Topological Contrastive Learning for Time Series. Namwoo Kim, Hyungryul Baik, Yoonjin Yoon
