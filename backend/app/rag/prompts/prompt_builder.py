class PromptBuilder:

    @staticmethod
    def build(
        question: str,
        chunks: list,
    ):
        context = "\n\n".join(
            chunk["text"]
            for chunk in chunks
        )

        return f"""
        You are an expert engineering assistant.

        Answer ONLY using the context below.

        If the answer cannot be found, say you don't know.

        Context:

        {context}

        Question:

        {question}
        """
