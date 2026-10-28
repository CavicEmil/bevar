import { useEffect, useId, useState } from "react";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Input from "./ui/Input";
import Button from "./ui/Button";
import "./EditProfileForm.css";

import { getMethods } from "../api/reference";
const levels = ["Just starting", "Getting adventurous", "An old hand"];
const initial = { name: "Marta", bio: "Turning seasonal finds into something worth keeping.", interests: [], level: "Getting adventurous", ingredient: "Rhubarb", photo: "" };

export default function EditProfileForm({ initialProfile = {} }) {
  const id = useId();
  const [profile, setProfile] = useState(() => ({ ...initial, ...initialProfile }));
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [methods, setMethods] = useState(null);
  const [methodsError, setMethodsError] = useState("");
  const [retryMethods, setRetryMethods] = useState(0);
  useEffect(() => {
    let active = true;
    getMethods().then(rows => {
      if (active) {
        setMethods(rows ?? []);
        setMethodsError("");
      }
    }).catch(() => {
      if (active) setMethodsError("Couldn’t load preserving methods.");
    });
    return () => { active = false; };
  }, [retryMethods]);
  const update = (key, value) => {
    setProfile(current => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const upload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 2 MB.");
      return;
    }
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result);
    reader.onerror = () => setPhotoError("That photo couldn’t be opened. Try another one.");
    reader.readAsDataURL(file);
  };

  return (
    <section className="marta-profile-preview mx-auto max-w-[620px] py-[32px] font-the-one text-dark-humor" aria-labelledby={`${id}-title`}>
      <p className="mb-[12px] text-small">A LITTLE MORE YOU</p>
      <Heading level={2} content="Make yourself at home." />
      <p className="mt-[10px] mb-[24px] text-body">Your kitchen, your curiosities, your next good jar.</p>
      <Card variant="fruit" className="!p-0">
        <form className="flex flex-col gap-[28px]" onSubmit={event => { event.preventDefault(); setSaved(true); }}>
          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-[20px]">
            <div className="marta-profile-avatar" aria-hidden="true">
              {profile.photo ? <img src={profile.photo} alt="" /> : (profile.name.trim()[0] || "M").toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col items-start gap-[12px]">
              <h3 id={`${id}-title`} className="text-heading-3">Nice to see you{profile.name.trim() ? `, ${profile.name.trim()}` : ""}.</h3>
              <label className="marta-profile-photo-link">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="m14.5 5.5 4 4M4 20l4.5-1 12-12a2.83 2.83 0 0 0-4-4l-12 12L4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Change your photo</span>
                <input type="file" accept="image/*" className="sr-only" onChange={upload} />
              </label>
              {photoError && <p role="alert" className="text-small">{photoError}</p>}
            </div>
          </div>
          <Input variant="name" label="What should we call you?" value={profile.name} maxLength={40} onChange={event => update("name", event.target.value)} />
          <label className="flex flex-col gap-[8px] text-body">
            What do you love making?
            <textarea className="marta-profile-field" rows={3} maxLength={180} value={profile.bio} onChange={event => update("bio", event.target.value)} />
            <span className="text-small opacity-70">A little about you. {profile.bio.length}/180</span>
          </label>
          <fieldset>
            <legend className="mb-[6px] text-heading-3">Your preserving preferences</legend>
            <p className="mb-[14px] text-body">Choose any methods you’d like to try. These optional preferences could help tailor recipe suggestions.</p>
            <div className="flex flex-wrap gap-[10px]">
              {!methods && !methodsError && <p role="status">Loading preserving methods…</p>}
              {methodsError && <div role="alert"><p>{methodsError}</p><Button content="Try again" variant="secondary" onClick={() => { setMethodsError(""); setRetryMethods(value => value + 1); }} /></div>}
              {methods?.length === 0 && <p>No preserving methods available yet.</p>}
              {(methods ?? []).map(method => <label className="marta-profile-choice" key={method.id}>
                <input className="sr-only" type="checkbox" checked={profile.interests.includes(method.id)} onChange={() => update("interests", profile.interests.includes(method.id) ? profile.interests.filter(value => value !== method.id) : [...profile.interests, method.id])} />
                <span>{profile.interests.includes(method.id) && <span aria-hidden="true">✓ </span>}{method.method}</span>
              </label>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-[12px] text-heading-3">How’s your kitchen confidence?</legend>
            <div className="flex flex-col gap-[8px]">
              {levels.map((level, index) => <label className="marta-profile-choice" key={level}>
                <input className="sr-only" type="radio" name={`${id}-confidence`} checked={profile.level === level} onChange={() => update("level", level)} />
                <span className="flex justify-between gap-[12px]">{level}<span aria-hidden="true">{profile.level === level ? "✓" : ["01", "02", "03"][index]}</span></span>
              </label>)}
            </div>
          </fieldset>
          <label className="flex flex-col gap-[8px] text-body">
            Your seasonal soft spot
            <select className="marta-profile-field" value={profile.ingredient} onChange={event => update("ingredient", event.target.value)}>
              {["Rhubarb", "Strawberries", "Apples", "Plums", "Blackberries", "Cucumbers"].map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="rounded-[14px] bg-white/50 p-[16px] text-body">
            <span className="text-small">A LITTLE TASTE OF YOU</span>
            <p className="mt-[6px]">{profile.level} · {profile.ingredient.toLowerCase()} enthusiast{profile.interests.length ? ` · here for ${profile.interests.map(id => methods?.find(method => method.id === id)?.method?.toLowerCase()).filter(Boolean).join(" & ")}` : ""}.</p>
          </div>
          <div className="flex flex-col gap-[10px]">
            <Button type="submit" content={saved ? "Freshly updated ✓" : "Save my profile"} className="w-full" />
            <div className="min-h-[24px] text-center text-small" role="status">
              {saved ? <span className="marta-profile-saved" key={profile.name + profile.bio}><span aria-hidden="true">✦ </span>Looking fresh! Your preview is updated.</span> : "Design preview · changes stay in this view."}
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
}
