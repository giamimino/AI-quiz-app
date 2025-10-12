"use client";
import { QuizObject } from "@/app/types/global";
import Counter from "@/components/Counter";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import CreateChallengeWrapper from "@/components/ui/challenges/CreateChallengeWrapper";
import DefaultButton from "@/components/ui/default-button";
import DefaultInput from "@/components/ui/default-input";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Loading from "@/components/ui/loading/Loading";
import {
  CHALLANGE_NO_OPTION_ERROR,
  CHALLANGE_QUIZ_LIMIT_ERROR,
  CHALLANGE_SAME_OPTION_ERROR,
  CHALlENGE_QUIZZES_GENERATE_ERROR,
  GENERIC_ERROR,
  NETWORK_ERROR,
} from "@/constants/errors";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import cuid from "cuid";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";

export default function CreateChallenge() {
  const [values, setValues] = useState<QuizObject[]>([
    { id: cuid(), question: "", options: Array(6).fill(""), answer: "" },
  ]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [openAi, setOpenAi] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false)
  const limit = 50;
  const scrollToSmooth = useSmoothScroll(1500);
  const quizLenghtTG = useRef<HTMLHeadingElement | null>(null); // TG => means "to generate"
  const quizTopicTG = useRef<HTMLInputElement>(null);
  const quizPromtTG = useRef<HTMLTextAreaElement>(null);

  const handleChangeQuestion = (idx: number, val: string) => {
    const newValues = [...values];
    newValues[idx] = { ...newValues[idx], question: val };
    setValues(newValues);
  };

  const handlePoPQuestion = (idx: number) => {
    setValues((prev) =>
      prev
        ? prev.filter((_, index) => (prev.length > 1 ? index !== idx : prev))
        : prev
    );
  };

  const handleUpdateOptions = (idx: number, options: string[]) => {
    const isOptionsSame = [...new Set(options)].length === 6;
    if (!isOptionsSame) {
      setMessage((prev) => [...prev, CHALLANGE_SAME_OPTION_ERROR]);
    }

    if (
      options.every((option) => option !== "") &&
      options.length === 6 &&
      isOptionsSame
    ) {
      const newValues = values.map((item, index) =>
        index === idx ? { ...item, options: [...options] } : item
      );
      setValues(newValues);
    }
  };

  const handleValidate = () => {
    const questionValidation = values.every((v) => v.question !== "");
    const optionsValidation = values
      .map((v) => v.options.every((option) => option !== ""))
      .every((item) => item);
    const answerValidation = values.every((v) => v.answer !== "");

    return (
      questionValidation &&
      optionsValidation &&
      answerValidation &&
      title.trim() !== "" &&
      description.trim() !== ""
    );
  };

  const handleCreateChallenge = () => {
    const validation = handleValidate();

    if(validation) {
      
    }
  };

  const handleSelectAnswer = (idx: number, option: string) => {
    setValues((prev) =>
      prev.map((item, index) =>
        index === idx ? { ...item, answer: option } : item
      )
    );
  };

  const handleGenerateQuizzes = async () => {
    const subject = quizTopicTG.current?.value;
    const prompt = quizPromtTG.current?.value;
    const length = Number(quizLenghtTG.current?.textContent);
    
    if (!subject || !length) {
      if(length === 0) {
        setMessage(prev => [...prev, CHALLANGE_QUIZ_LIMIT_ERROR])
      } else {
        setMessage((prev) => [...prev, CHALlENGE_QUIZZES_GENERATE_ERROR]);
      }
      return;
    }
    setLoadingAi(true)
    const res = await fetch("/api/ai/generate/challenge", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ length, prompt, subject }),
    });
    const data = await res.json();
    if (data.success) {
      console.log(data.res);
      
      const content =
      data.res?.choices?.[0]?.message?.content ||
        data.res?.result?.output_text ||
        "[]";

      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        const parsed = JSON.parse(cleaned);
        const newValues = [...values, ...Array.isArray(parsed) ? parsed : []];
        if(newValues.length > 50) {
          setMessage(prev => [...prev, CHALLANGE_QUIZ_LIMIT_ERROR])
        }
        setValues(newValues);
        setLoadingAi(false)
        setOpenAi(false)
      } catch (err) {
        console.error("Failed to parse AI JSON:", err);
      }
    } else {
      setLoadingAi(false)
      setMessage(prev => [...prev, data.message])
    }
  };

  return (
    <div className="[&_h1]:text-white flex flex-col gap-2.5 pb-12 px-2.5">
      <DefaultButton
        label="Create"
        wFit
        noSelect
        onClick={handleCreateChallenge}
        fixed
        tlCorner
      />
      <DefaultButton
        icon="si:ai-edit-line"
        wFit
        noSelect
        fixed
        trCorner
        size={18}
        onClick={() => setOpenAi(true)}
      />
      <AnimatePresence initial={false}>
        {openAi && (
          <motion.div
            initial={{ right: "-100%", opacity: 0 }}
            animate={{ right: 0, opacity: 1 }}
            exit={{ right: "-100%", opacity: 0.8 }}
            className="flex flex-col gap-2 fixed top-0 h-full bg-neutral-800 p-5 
            [&_p]:text-white/90"
          >
            {loadingAi && <Loading />}
            <DefaultButton
              wFit
              noSelect
              icon="material-symbols:close-rounded"
              onClick={() => setOpenAi(false)}
            />
            <h1 className="text-white font-semibold text-lg">Chat with AI</h1>
            <div className="flex flex-col gap-2.5">
              <p>How many quizzes would you like to generate?</p>
              <Counter ref={quizLenghtTG} currentLenght={values.length} />
            </div>
            <div className="flex flex-col gap-2.5">
              <p>Type a topic to generate quiz questions.</p>
              <input
                type="text"
                ref={quizTopicTG}
                className="h-8 rounded-xs outline-none px-2 transition-all duration-200
                border border-amber-50 text-white"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <p>prompt:</p>
              <textarea
                className="h-24 rounded-xs outline-none p-2 transition-all duration-200
                border border-amber-50 text-white"
              ></textarea>
            </div>
            <DefaultButton label="Generate" noSelect onClick={handleGenerateQuizzes} />
          </motion.div>
        )}
      </AnimatePresence>
      <ErrorsWrapper>
        <AnimatePresence initial={false}>
          {message.length > 0 &&
            message.map((m, idx) => (
              <Error
                key={`${m}-${idx}`}
                error={m}
                handleClose={(error) =>
                  setMessage((prev) => prev.filter((_, index) => index !== idx))
                }
              />
            ))}
        </AnimatePresence>
      </ErrorsWrapper>
      <ChallengesWrapper gap={0.25} col YCenter>
        <h1 className="text-center">What{"’"}s the title of your challenge?</h1>
        <DefaultInput
          value={title}
          center
          color="white/70"
          onChange={(e) => setTitle(e.target.value)}
        />
      </ChallengesWrapper>
      <ChallengesWrapper gap={0.25} col YCenter>
        <h1 className="text-center">
          What{"’"}s the description of your challenge?
        </h1>
        <DefaultInput
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          textarea
        />
      </ChallengesWrapper>
      <AnimatePresence initial={false}>
        <ChallengesWrapper key={"ChallengesWrapper-1"} col YCenter noSelect>
          {values.map((val, idx) => (
            <motion.div
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              key={val.id}
            >
              <CreateChallengeWrapper col gap={2.5}>
                <div className="flex justify-between">
                  <p className="text-white">
                    Question{" "}
                    {(values.indexOf(val) + 1).toFixed().padStart(2, "0")}
                  </p>
                  <button
                    className="text-red-600 cursor-pointer"
                    onClick={() => handlePoPQuestion(idx)}
                  >
                    <Icon icon={"mingcute:close-fill"} />
                  </button>
                </div>
                <DefaultInput
                  value={val.question}
                  onChange={(e) => handleChangeQuestion(idx, e.target.value)}
                />
                <p className="text-white/90">
                  Possible Answers {"—"} Select the Correct Option{" "}
                </p>
                <form
                  className="flex flex-col gap-2.5"
                  onSubmit={(e) => {
                    e.preventDefault();

                    const formData = new FormData(e.currentTarget);
                    const newOptions = Array.from(
                      formData.values().map(String)
                    );

                    handleUpdateOptions(idx, newOptions);
                  }}
                >
                  <div className="flex flex-wrap gap-5 text-white">
                    {values[idx].options.map((option, index) =>
                      option === "" ? (
                        <input
                          key={`${val.id}-option-${index}`}
                          name={`option-${index}`}
                          type="text"
                          className={`flex-[calc(100%/4)] w-20 mx-auto text-xs h-6 
                            border-1 border-white focus:outline-none rounded-sm p-1`}
                        />
                      ) : (
                        <button
                          type="button"
                          key={`${val.id}-option-${index}`}
                          className={clsx(
                            `flex-[calc(100%/4)] w-20 text-base h-fit
                            p-1 rounded-sm cursor-pointer flex 
                            items-center justify-center`,
                            val.answer === option
                              ? "bg-purple-600"
                              : "bg-white/10 hover:bg-white/15"
                          )}
                          onClick={() => handleSelectAnswer(idx, option)}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                  <DefaultButton
                    type="submit"
                    small
                    wFit
                    mCenter
                    icon="hugeicons:sent"
                  />
                </form>
              </CreateChallengeWrapper>
            </motion.div>
          ))}
        </ChallengesWrapper>
        <motion.div
          layout
          key={"new-value-create-button"}
          className="flex justify-center"
        >
          <DefaultButton
            label="Add new Value"
            wFit
            noSelect
            onClick={() => {
              if (values.length < limit) {
                setValues((prev) => [
                  ...prev,
                  {
                    question: "",
                    id: cuid(),
                    options: Array(6).fill(""),
                    answer: "",
                  },
                ]);
                setTimeout(() => {
                  scrollToSmooth(window.scrollY + 300);
                }, 50);
              }
            }}
          />
          <p className="mt-auto text-gray-500">
            {values.length}/{limit}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
