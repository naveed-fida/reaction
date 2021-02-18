FactoryGirl.define do
  factory :action do
    actionable { create(:card) }
    description { FFaker::Lorem.sentence }
  end
end
