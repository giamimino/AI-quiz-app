"use client";
import { QuizObject } from "@/app/types/global";
import QuizOptionCreate from "@/components/quiz/QuizOptionCreate";
import QuizOptions from "@/components/quiz/QuizOptions";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import CreateChallengeWrapper from "@/components/ui/challenges/CreateChallengeWrapper";
import DefaultButton from "@/components/ui/default-button";
import DefaultInput from "@/components/ui/default-input";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import cuid from "cuid";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export default function ManualyCreateChallenge() {
  const [values, setValues] = useState<QuizObject[]>([
    { id: cuid(), question: "", options: Array(6).fill(""), answer: "" },
  ]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const limit = 50;
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
    const newValues = values.map((item, index) =>
      index === idx ? { ...item, options } : item
    );
    setValues(newValues);
  };

  return (
    <div className="[&_h1]:text-white flex flex-col gap-2.5 pb-12 px-2.5">
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
                            `flex-[calc(100%/4)] w-20 text-base h-6
                            p-1 rounded-sm cursor-pointer flex 
                            items-center justify-center`,
                            val.answer === option
                              ? "bg-purple-600"
                              : "bg-white/10 hover:bg-white/15"
                          )}
                          onClick={(e) => {
                            e.preventDefault();

                            setValues((prev) =>
                              prev
                                ? prev.map((item, index) =>
                                    index === idx
                                      ? { ...item, answer: option }
                                      : item
                                  )
                                : prev
                            );
                          }}
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
        <motion.div layout className="flex justify-center">
          <DefaultButton
            label="Add new Value"
            wFit
            noSelect
            onClick={() =>
              values.length < limit &&
              setValues((prev) => [
                ...prev,
                {
                  question: "",
                  id: cuid(),
                  options: Array(6).fill(""),
                  answer: "",
                },
              ])
            }
          />
          <p className="mt-auto text-gray-500">
            {values.length}/{limit}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
